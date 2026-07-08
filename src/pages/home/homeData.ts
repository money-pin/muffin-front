// 홈 화면 목데이터 — TODO: 홈 대시보드 API 연동 시 교체

export interface HomeUser {
  nickname: string;
  streakDays: number; // 연속 학습 일수
  message: string; // 캐릭터 말풍선 문구
}

export interface HomeAssets {
  total: number; // 총 자산(원)
  change: number; // 전일 대비 변동액(원, 음수 가능)
  changeRate: number; // 전일 대비 변동률(%)
  lastInvestedAt: { month: number; day: number }; // 최근 투자 성과 날짜
}

export const HOME_USER: HomeUser = {
  nickname: "예은",
  streakDays: 5,
  message: "투자 성과가 아주 좋아요!",
};

export const HOME_ASSETS: HomeAssets = {
  total: 1_045_000,
  change: 45_000,
  changeRate: 4.5,
  lastInvestedAt: { month: 5, day: 7 },
};
