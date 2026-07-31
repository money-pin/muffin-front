// 홈 화면 mock 데이터.
// TODO: 홈 API 확장 시 streak/message, 투자 결과 모달, TOP3 섹터도 서버 응답으로 교체

export interface HomeUser {
  nickname: string;
  streakDays: number;
  message: string;
}

export const HOME_USER: HomeUser = {
  nickname: "예은",
  streakDays: 5,
  message: "투자 성과가 아주 좋아요!",
};

export interface InvestResult {
  date: string;
  profit: number;
  profitRate: number;
  principal: number;
  finalAssets: number;
}

export const HOME_INVEST_RESULT: InvestResult = {
  date: "2026.05.07",
  profit: 48_000,
  profitRate: 4.8,
  principal: 1_000_000,
  finalAssets: 1_045_000,
};

export interface TopSector {
  rank: 1 | 2 | 3;
  name: string;
  change: number;
  changeRate: number;
}

export const HOME_TOP_SECTORS: TopSector[] = [
  { rank: 1, name: "반도체", change: 45_000, changeRate: 12.5 },
  { rank: 2, name: "테크", change: 85_000, changeRate: 8.7 },
  { rank: 3, name: "코인", change: 65_000, changeRate: 6.8 },
];
