import { apiRequest } from "./api";
import { saveAccessToken } from "./auth";

interface AccessTokenResult {
  accessToken: string;
}

// 회원가입 1단계: 계정 생성 (accessToken 발급 + refreshToken 쿠키), 토큰 저장
export async function signup(params: {
  name: string;
  email: string;
  password: string;
  termAgreed: boolean;
}) {
  const { accessToken } = await apiRequest<AccessTokenResult>(
    "/api/auth/signup",
    { method: "POST", body: params },
  );
  saveAccessToken(accessToken);
}

// 회원가입 2단계: 이메일 인증번호 발송 (계정 토큰 필요). 만료(초)를 반환
export async function sendEmailVerification(): Promise<number> {
  const { expiresIn } = await apiRequest<{ expiresIn: number }>(
    "/api/auth/email/verification",
    { method: "POST", body: {}, auth: true },
  );
  return expiresIn;
}

// 회원가입 3단계: 인증번호 확인
export async function confirmEmailVerification(code: string) {
  return apiRequest<void>("/api/auth/email/verification/confirm", {
    method: "POST",
    body: { code },
    auth: true,
  });
}

// 로그아웃 (accessToken blacklist + refreshToken 쿠키 만료)
export async function logout() {
  return apiRequest<void>("/api/auth/logout", {
    method: "POST",
    body: {},
    auth: true,
  });
}

// 회원 탈퇴 (소프트 딜리트)
export async function withdraw() {
  return apiRequest<void>("/api/auth/account", {
    method: "DELETE",
    body: {},
    auth: true,
  });
}

// 온보딩 완료 (초기 투자금 지급). 멱등 처리
export async function completeOnboarding(): Promise<{ totalAsset: number }> {
  return apiRequest<{ totalAsset: number }>("/api/onboarding/complete", {
    method: "POST",
    body: {},
    auth: true,
  });
}
