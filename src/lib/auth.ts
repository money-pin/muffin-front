// 인증 토큰 관리
// accessToken: 응답 body로 받아 localStorage에 저장 (FE가 관리)
// refreshToken: 백엔드가 httpOnly 쿠키(Set-Cookie)로 내려주므로 FE에서 접근/삭제 불가
const ACCESS_TOKEN_KEY = "muffin:accessToken";
// 어떤 소셜 계정으로 로그인했는지 (애플 탈퇴 시 재로그인 필요 여부 판단, #266)
const AUTH_PROVIDER_KEY = "muffin:authProvider";

export type AuthProvider = "google" | "kakao" | "apple";
export const AUTH_SESSION_CHANGED_EVENT = "muffin:auth-session-changed";
// 한 앱 실행 안에서 로그인/로그아웃과 단순 access token 갱신을 구분한다.
let sessionRevision = 0;
export const getAuthSessionRevision = () => sessionRevision;
function notifySessionChanged() {
  if (typeof window !== "undefined")
    window.dispatchEvent(new Event(AUTH_SESSION_CHANGED_EVENT));
}

export function saveAccessToken(
  token: string,
  { preserveSession = false }: { preserveSession?: boolean } = {},
) {
  if (!preserveSession) sessionRevision++;
  try {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  } catch {
    // 저장 실패(프라이빗 모드 등)는 무시
  }
  notifySessionChanged();
}

export function getAccessToken(): string | null {
  try {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function saveAuthProvider(provider: AuthProvider) {
  try {
    localStorage.setItem(AUTH_PROVIDER_KEY, provider);
  } catch {
    // 저장 실패는 무시
  }
}

export function getAuthProvider(): AuthProvider | null {
  try {
    const value = localStorage.getItem(AUTH_PROVIDER_KEY);
    return value === "google" || value === "kakao" || value === "apple"
      ? value
      : null;
  } catch {
    return null;
  }
}

export function clearAccessToken() {
  sessionRevision++;
  try {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(AUTH_PROVIDER_KEY);
  } catch {
    // 삭제 실패는 무시
  }
  notifySessionChanged();
}

export function isLoggedIn(): boolean {
  return getAccessToken() !== null;
}
