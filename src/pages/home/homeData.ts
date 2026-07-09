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

export interface HomeNews {
  id: number;
  title: string;
  category: string; // 예: 경제, IT, 세계
  date: string; // YYYY-MM-DD
  views: string; // 예: "31만"
  image: "economy" | "IT" | "world"; // newscard 에셋 키
}

export interface InvestResult {
  date: string; // 정산 기준일 (YYYY.MM.DD)
  profit: number; // 최종 수익금(원, 음수 가능)
  profitRate: number; // 수익률(%)
  principal: number; // 투자 원금(원)
  finalAssets: number; // 최종 자산(원)
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
  change: number; // 수익액(원)
  changeRate: number; // 수익률(%)
}

export const HOME_TOP_SECTORS: TopSector[] = [
  { rank: 1, name: "반도체", change: 45_000, changeRate: 12.5 },
  { rank: 2, name: "테크", change: 85_000, changeRate: 8.7 },
  { rank: 3, name: "코인", change: 65_000, changeRate: 6.8 },
];

export const HOME_NEWS: HomeNews[] = [
  {
    id: 1,
    title: "엔비디아 실적 발표, 국내 반도체 ETF에도 훈풍 부나?",
    category: "경제",
    date: "2026-05-08",
    views: "31만",
    image: "economy",
  },
  {
    id: 2,
    title: "AI 반도체 수요 폭증, 삼성전자 HBM 증설 나선다",
    category: "IT",
    date: "2026-05-08",
    views: "24만",
    image: "IT",
  },
  {
    id: 3,
    title: "美 연준 금리 동결, 신흥국 증시 안도 랠리",
    category: "세계",
    date: "2026-05-07",
    views: "18만",
    image: "world",
  },
];
