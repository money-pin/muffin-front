import type { SectorPerformanceDetail } from "@/pages/invest/stats/types";

export interface ParticipatedMyRanking {
  participated: true;
  rank: number;
  nickname: string;
  percentile: number;
}

export interface NotParticipatedMyRanking {
  participated: false;
}

export type MyRanking = ParticipatedMyRanking | NotParticipatedMyRanking;

export interface MyRankingData {
  weekLabel: string;
  myRank: MyRanking;
}

export interface WeeklyRankingItem {
  rank: number;
  nickname: string;
  weeklyProfit: number;
  weeklyProfitRate: number;
  characterType?: string;
  sectors?: SectorPerformanceDetail[];
}

export interface WeeklyRankingData {
  weekLabel: string;
  top10: WeeklyRankingItem[];
}
