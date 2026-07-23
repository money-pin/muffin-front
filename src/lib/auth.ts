// 인증 토큰 관리
// accessToken: 응답 body로 받아 localStorage에 저장 (FE가 관리)
// refreshToken: 백엔드가 httpOnly 쿠키(Set-Cookie)로 내려주므로 FE에서 접근/삭제 불가
const ACCESS_TOKEN_KEY = "muffin:accessToken";

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

export function clearAccessToken() {
  try {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  } catch {
    // 삭제 실패는 무시
  }
}

export function isLoggedIn(): boolean {
  return getAccessToken() !== null;
}
