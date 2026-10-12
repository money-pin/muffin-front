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
