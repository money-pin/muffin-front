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
  termsAgreed: boolean;
}) {
  const { accessToken } = await apiRequest<AccessTokenResult>("/auth/signup", {
    method: "POST",
    body: params,
  });
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

// ─────────────────────────────────────────────────────────────
// 계정(아이디) 찾기 / 비밀번호 찾기 (이슈 #265)
// ⚠️ 아래 엔드포인트/요청·응답 형태는 백엔드 스펙 확정 전 임시(tentative)값입니다.
//    스펙이 나오면 경로와 필드만 맞춰주면 화면은 그대로 동작합니다.
//    회원가입 이메일 인증 플로우(위)와 동일한 패턴을 전제로 잡아두었습니다.
// ─────────────────────────────────────────────────────────────

// 계정(이메일) 찾기: 가입 시 입력한 이름으로 마스킹된 이메일을 조회한다.
// TODO(#265): 이름만으로 식별이 어려우면 백엔드와 추가 식별자(휴대폰 등) 협의 필요
export async function findAccountEmail(params: {
  name: string;
}): Promise<{ email: string }> {
  return apiRequest<{ email: string }>("/auth/email/find", {
    method: "POST",
    body: params,
  });
}

// 비밀번호 재설정 1단계: 이메일로 인증번호 발송. 만료(초)를 반환
// TODO(#265): 경로/응답 필드(expiresIn) 백엔드 확정 시 조정
export async function requestPasswordResetCode(email: string): Promise<number> {
  const { expiresIn } = await apiRequest<{ expiresIn: number }>(
    "/auth/password/reset/verification",
    { method: "POST", body: { email } },
  );
  return expiresIn;
}

// 비밀번호 재설정 2단계: 인증번호 확인 → 재설정 토큰 발급
// TODO(#265): resetToken 발급 방식(응답 body vs 쿠키) 백엔드 확정 시 조정
export async function confirmPasswordResetCode(params: {
  email: string;
  code: string;
}): Promise<{ resetToken: string }> {
  return apiRequest<{ resetToken: string }>(
    "/auth/password/reset/verification/confirm",
    { method: "POST", body: params },
  );
}

// 비밀번호 재설정 3단계: 새 비밀번호 저장
// TODO(#265): resetToken 전달 위치(body vs 헤더) 백엔드 확정 시 조정
export async function resetPassword(params: {
  resetToken: string;
  newPassword: string;
}): Promise<void> {
  return apiRequest<void>("/auth/password/reset", {
    method: "POST",
    body: params,
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

// 온보딩 설문 결과로 결정된 캐릭터를 서버에 저장하고 캐릭터·추천 섹터를 받는다
interface OnboardingCharacterResult {
  characterId: number;
  characterType: string;
  characterName: string;
  characterDescription: string;
  imageUrl: string;
  recommendedSectors: { sectorCode: string; sectorName: string }[];
}

export async function saveOnboardingCharacter(body: {
  muffin: string; // 설문으로 결정된 머핀 타입 (plain/sprinkle/butter)
  firstQuestion: number; // 각 질문에서 선택한 보기 번호 (1-based)
  secondQuestion: number;
  thirdQuestion: number;
}): Promise<OnboardingCharacterResult> {
  return apiRequest<OnboardingCharacterResult>("/api/onboarding/character", {
    method: "POST",
    // 백엔드 enum은 대문자(PLAIN/SPRINKLE/BUTTER) — 소문자로 오면 400
    body: { ...body, muffin: body.muffin.toUpperCase() },
    auth: true,
  });
}

// 온보딩 완료 (초기 투자금 지급). 멱등 처리
export async function completeOnboarding(): Promise<{ totalAsset: number }> {
  return apiRequest<{ totalAsset: number }>("/api/onboarding/completion", {
    method: "PUT",
    body: {},
    auth: true,
  });
}
