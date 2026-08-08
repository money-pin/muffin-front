export type WeeklyRankingStatus = "READY" | "CALCULATING" | "EMPTY";

export interface WeeklyRankingMyRankApi {
  participated: boolean;
  rank: number | null;
  nickname: string | null;
  topPercent: number | null;
}

export interface WeeklyRankingSectorDetailApi {
  sectorCode: string;
  sectorName: string;
  profitAmount: number;
  profitRate: number;
  totalInvestment: number;
}

export interface WeeklyRankingUserDetailApi {
  totalInvestment: number;
  sectors: WeeklyRankingSectorDetailApi[];
}

export interface WeeklyRankingCharacterApi {
  characterId: number;
  characterType: string;
  characterName: string;
  characterImageUrl: string | null;
}

export interface WeeklyRankingItemApi {
  rank: number;
  nickname: string;
  character?: WeeklyRankingCharacterApi | null;
  profitAmount: number;
  profitRate: number;
  detail?: WeeklyRankingUserDetailApi;
}

export interface WeeklyRankingApi {
  rankingStatus: WeeklyRankingStatus;
  weekStartDate: string;
  weekEndDate: string;
  weekOfYear: number;
  weekLabel: string;
  myRank: WeeklyRankingMyRankApi | null;
  top10: WeeklyRankingItemApi[];
}
