import { apiRequest } from "./api";

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
