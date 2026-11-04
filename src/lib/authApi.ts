import { apiRequest } from "./api";

// 로그아웃 (accessToken blacklist + refreshToken 쿠키 만료)
export async function logout() {
  return apiRequest<void>("/api/auth/logout", {
    method: "POST",
    body: {},
    auth: true,
  });
}

// 회원 탈퇴 (소프트 딜리트)
// 애플 계정은 탈퇴 직전 다시 로그인해 받은 authorizationCode를 보내고(애플 연결 해제),
// 구글·카카오 계정은 빈 body로 탈퇴한다. (AUTH-09-2)
export async function withdraw(options: { authorizationCode?: string } = {}) {
  return apiRequest<void>("/api/auth/account", {
    method: "DELETE",
    body: options.authorizationCode
      ? { authorizationCode: options.authorizationCode }
      : {},
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
