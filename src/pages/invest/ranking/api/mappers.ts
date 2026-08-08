import { getSectorMeta } from "@/pages/invest/constants/sectorMeta";
import type { SectorPerformanceDetail } from "@/pages/invest/stats/types";

import type {
  WeeklyRankingApi,
  WeeklyRankingItemApi,
  WeeklyRankingMyRankApi,
  WeeklyRankingSectorDetailApi,
  WeeklyRankingStatus,
} from "./apiTypes";
import type { MyRanking, WeeklyRankingItem } from "../types";

export interface WeeklyRankingData {
  status: WeeklyRankingStatus;
  weekLabel: string;
  myRank: MyRanking;
  top10: WeeklyRankingItem[];
}

export function mapWeeklyRankingApiToData(
  response: WeeklyRankingApi,
): WeeklyRankingData {
  return {
    status: response.rankingStatus,
    weekLabel: response.weekLabel,
    myRank: mapMyRanking(response.myRank),
    top10: response.top10.map(mapWeeklyRankingItem),
  };
}

function mapMyRanking(myRank: WeeklyRankingMyRankApi | null): MyRanking {
  if (
    !myRank?.participated ||
    myRank.rank === null ||
    myRank.nickname === null ||
    myRank.topPercent === null
  ) {
    return { participated: false };
  }

  return {
    participated: true,
    rank: myRank.rank,
    nickname: myRank.nickname,
    percentile: myRank.topPercent,
  };
}

function mapWeeklyRankingItem(item: WeeklyRankingItemApi): WeeklyRankingItem {
  return {
    rank: item.rank,
    nickname: item.nickname,
    weeklyProfit: item.profitAmount,
    weeklyProfitRate: item.profitRate,
    characterType: item.character?.characterType,
    characterImageUrl: item.character?.characterImageUrl ?? undefined,
    sectors: item.detail?.sectors.map(mapRankingSectorDetail) ?? [],
  };
}

function mapRankingSectorDetail(
  sector: WeeklyRankingSectorDetailApi,
): SectorPerformanceDetail {
  const sectorMeta = getSectorMeta(sector.sectorCode, sector.sectorName);

  return {
    id: sectorMeta.code,
    name: sector.sectorName || sectorMeta.name,
    iconSrc: sectorMeta.iconSrc,
    profitAmount: sector.profitAmount,
    profitRate: sector.profitRate,
    investmentAmount: sector.totalInvestment,
  };
}
