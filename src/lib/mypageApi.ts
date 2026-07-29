import { apiRequest, ApiError } from "./api";

// 백엔드가 온보딩 미완료 계정에 홈/마이 응답으로 내려주는 코드
const ONBOARDING_REQUIRED_CODE = "USER_409_001";

// 닉네임 변경 (온보딩 완료·마이페이지 공용). 변경된 닉네임을 반환한다.
export async function updateNickname(
  nickname: string,
): Promise<{ nickname: string }> {
  return apiRequest<{ nickname: string }>("/api/mypage/nickname", {
    method: "PATCH",
    body: { nickname },
    auth: true,
  });
}

// 홈 화면 프로필 정보. streak·recentNews 등은 후속 PR에서 사용 예정
export interface MyHome {
  nickname: string;
  character: {
    characterId: number;
    characterType: string;
    characterName: string;
    characterImageUrl: string;
  };
}

// 홈 프로필 조회 (GET /api/mypage/home)
export async function getMyHome(): Promise<MyHome> {
  return apiRequest<MyHome>("/api/mypage/home", { auth: true });
}

// 로그인 후 진입 경로 결정.
// 온보딩 완료면 홈, 미완료(백엔드가 홈/마이에 409 USER_409_001)면 온보딩으로 보낸다.
export async function resolveEntryRoute(): Promise<"/home" | "/onboarding"> {
  try {
    await getMyHome();
    return "/home";
  } catch (error) {
    if (error instanceof ApiError && error.code === ONBOARDING_REQUIRED_CODE) {
      return "/onboarding";
    }
    // 그 외 오류(네트워크 등)는 일단 홈으로 — 홈에서 재조회/처리
    return "/home";
  }
}
