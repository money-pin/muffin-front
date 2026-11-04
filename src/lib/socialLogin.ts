import { Capacitor } from "@capacitor/core";
import { SocialLogin } from "@capgo/capacitor-social-login";
import { CapacitorKakaoLogin } from "@team-lepisode/capacitor-kakao-login";

import { apiRequest } from "./api";
import { saveAccessToken, saveAuthProvider, type AuthProvider } from "./auth";

// 소셜 로그인 (#266)
// - iOS 앱: 각 SDK로 로그인해 ID 토큰을 받는다 (백엔드가 앱 키·번들 ID로 발급된 토큰만 받음)
// - 웹: 구글만 리다이렉트 방식(src/lib/google.ts). 카카오·애플은 앱에서만 지원
// 받은 ID 토큰은 POST /auth/{provider}로 넘겨 머핀 accessToken으로 바꾼다.

export class SocialLoginCancelledError extends Error {}

export function isNativeApp() {
  return Capacitor.isNativePlatform();
}

interface AuthResult {
  accessToken: string;
}

interface SocialLoginBody {
  idToken: string;
  // 애플은 처음 로그인할 때만 이름을 준다
  givenName?: string | null;
  familyName?: string | null;
}

// ID 토큰을 머핀 accessToken으로 교환하고 저장한다
export async function exchangeSocialToken(
  provider: AuthProvider,
  body: SocialLoginBody,
) {
  const { accessToken } = await apiRequest<AuthResult>(`/auth/${provider}`, {
    method: "POST",
    body,
  });
  saveAccessToken(accessToken);
  saveAuthProvider(provider);
}

// ── 앱(iOS) SDK 초기화 ──────────────────────────────

const BUNDLE_ID = "kr.ai.muffin";

let kakaoReady: Promise<void> | null = null;
let socialLoginReady: Promise<void> | null = null;

function initKakao() {
  const appKey = import.meta.env.VITE_KAKAO_NATIVE_APP_KEY;
  if (!appKey) throw new Error("카카오 앱 키가 설정되지 않았어요.");
  kakaoReady ??= CapacitorKakaoLogin.initialize({ appKey }).catch((error) => {
    kakaoReady = null;
    throw error;
  });
  return kakaoReady;
}

function initSocialLogin() {
  socialLoginReady ??= SocialLogin.initialize({
    // 앱에서는 OS 기능을 쓰므로 clientId는 구분용. authorizationCode는 탈퇴에 쓴다
    apple: { clientId: BUNDLE_ID, useProperTokenExchange: true },
    google: import.meta.env.VITE_GOOGLE_IOS_CLIENT_ID
      ? {
          iOSClientId: import.meta.env.VITE_GOOGLE_IOS_CLIENT_ID,
          mode: "online",
        }
      : undefined,
  }).catch((error) => {
    socialLoginReady = null;
    throw error;
  });
  return socialLoginReady;
}

// 사용자가 로그인 창을 닫은 경우는 오류 안내 없이 넘긴다
function isCancelError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  return /cancel|취소|1001/i.test(message);
}

async function runNativeLogin<T>(login: () => Promise<T>): Promise<T> {
  try {
    return await login();
  } catch (error) {
    if (isCancelError(error)) throw new SocialLoginCancelledError();
    throw error;
  }
}

// ── 앱(iOS) 로그인 ──────────────────────────────────

export async function loginWithKakaoNative() {
  await initKakao();
  const result = await runNativeLogin(() => CapacitorKakaoLogin.login());
  // 웹 리다이렉트 결과("redirecting")는 앱에서 오지 않는다.
  // 카카오 디벨로퍼스에서 OpenID Connect를 켜야 idToken이 온다
  const idToken = "idToken" in result ? result.idToken : undefined;
  if (!idToken) throw new Error("카카오 로그인 정보를 받지 못했어요.");
  await exchangeSocialToken("kakao", { idToken });
}

async function signInWithApple() {
  await initSocialLogin();
  const { result } = await runNativeLogin(() =>
    SocialLogin.login({
      provider: "apple",
      options: { scopes: ["email", "name"] },
    }),
  );
  return result;
}

export async function loginWithAppleNative() {
  const result = await signInWithApple();
  if (!result.idToken) throw new Error("애플 로그인 정보를 받지 못했어요.");
  await exchangeSocialToken("apple", {
    idToken: result.idToken,
    givenName: result.profile.givenName,
    familyName: result.profile.familyName,
  });
}

export async function loginWithGoogleNative() {
  if (!import.meta.env.VITE_GOOGLE_IOS_CLIENT_ID) {
    throw new Error("구글 앱 로그인이 설정되지 않았어요.");
  }
  await initSocialLogin();
  const { result } = await runNativeLogin(() =>
    SocialLogin.login({
      provider: "google",
      options: { scopes: ["email", "profile"] },
    }),
  );
  if (result.responseType !== "online" || !result.idToken) {
    throw new Error("구글 로그인 정보를 받지 못했어요.");
  }
  await exchangeSocialToken("google", { idToken: result.idToken });
}

// 애플 계정 탈퇴 직전 다시 로그인해 받은 authorization code (5분 유효, 1회용)
export async function getAppleWithdrawalCode() {
  const result = await signInWithApple();
  if (!result.authorizationCode) {
    throw new Error("애플 인증 정보를 받지 못했어요.");
  }
  return result.authorizationCode;
}
