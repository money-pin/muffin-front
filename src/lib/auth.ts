// 인증 토큰 관리
// accessToken: 응답 body로 받아 localStorage에 저장 (FE가 관리)
// refreshToken: 백엔드가 httpOnly 쿠키(Set-Cookie)로 내려주므로 FE에서 접근/삭제 불가
const ACCESS_TOKEN_KEY = "muffin:accessToken";
// 어떤 소셜 계정으로 로그인했는지 (애플 탈퇴 시 재로그인 필요 여부 판단, #266)
const AUTH_PROVIDER_KEY = "muffin:authProvider";

export type AuthProvider = "google" | "kakao" | "apple";

export function saveAccessToken(token: string) {
  try {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  } catch {
    // 저장 실패(프라이빗 모드 등)는 무시
  }
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
  try {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(AUTH_PROVIDER_KEY);
  } catch {
    // 삭제 실패는 무시
  }
}

export function isLoggedIn(): boolean {
  return getAccessToken() !== null;
}
