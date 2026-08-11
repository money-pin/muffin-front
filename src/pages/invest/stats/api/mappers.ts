import { getSectorMeta } from "@/pages/invest/constants/sectorMeta";

import type {
  StatsHistoryApi,
  StatsRecentDetailApi,
  StatsSummaryApi,
} from "./apiTypes";
import type {
  InvestmentResultDate,
  ProfitHistoryData,
  ProfitHistoryPeriod,
  RecentPerformanceDetailData,
  StatsSummaryData,
  TopSector,
} from "../types";
import { formatProfitHistoryTitle } from "../utils/profitHistoryDate";

const API_PERIOD_TO_UI_PERIOD = {
  DAY: "day",
  WEEK: "week",
  MONTH: "month",
  YEAR: "year",
  ALL: "all",
} satisfies Record<StatsHistoryApi["period"], ProfitHistoryPeriod>;

// API 응답을 화면 컴포넌트가 사용하는 UI 모델로 변환합니다.
export function mapStatsSummaryToStatsSummaryData(
  response: StatsSummaryApi,
): StatsSummaryData {
  return {
    investDate: response.investDate
      ? parseInvestmentResultDate(response.investDate)
      : undefined,
    cumulativeProfit: {
      amount: response.cumulativeProfitAmount,
      rate: response.cumulativeProfitRate,
    },
    trend: response.graph.flatMap((point) => {
      if (!parseOptionalInvestmentResultDate(point.date)) return [];

      return {
        label: point.date,
        value: point.cumulativeProfitRate,
      };
    }),
    topSectors: response.topSectors.flatMap((sector) => {
      if (!isTopSectorRank(sector.rank)) return [];
      const meta = getSectorMeta(sector.sectorCode, sector.sectorName);

      return {
        rank: sector.rank,
        name: sector.sectorName || meta.name,
        profitAmount: sector.profitAmount,
        profitRate: sector.profitRate,
      };
    }),
    profile: response.investmentType
      ? {
          type: response.investmentType.label,
          description: response.investmentType.description,
          details: response.investmentType.bullets,
        }
      : undefined,
  };
}

export function mapStatsHistoryToProfitHistoryData(
  response: StatsHistoryApi,
): ProfitHistoryData {
  const period = API_PERIOD_TO_UI_PERIOD[response.period];
  const title =
    period === "all"
      ? formatProfitHistoryTitle(period)
      : formatProfitHistoryTitle(period, requireStatsHistoryDate(response));

  return {
    period: response.period,
    date: response.date,
    hasPrev: response.hasPrev,
    hasNext: response.hasNext,
    summary: {
      title,
      profitAmount: response.summary.profitAmount,
      profitRate: response.summary.profitRate,
      investmentAmount: response.summary.totalInvestment,
    },
    sort: response.sort,
    sectors: response.sectors.map((sector) => {
      const meta = getSectorMeta(sector.sectorCode, sector.sectorName);

      return {
        sectorCode: sector.sectorCode,
        name: sector.sectorName || meta.name,
        iconSrc: meta.iconSrc,
        profitAmount: sector.profitAmount,
        profitRate: sector.profitRate,
        investmentAmount: sector.totalInvestment,
      };
    }),
  };
}

export function mapStatsRecentDetailToRecentPerformanceDetailData(
  response: StatsRecentDetailApi,
): RecentPerformanceDetailData {
  return {
    summary: response.date
      ? {
          date: parseInvestmentResultDate(response.date),
          profitAmount: response.profitAmount,
          profitRate: calculateProfitRate(
            response.profitAmount,
            response.totalInvestment,
          ),
          investmentAmount: response.totalInvestment,
        }
      : undefined,
    sectors: response.sectors.map((sector) => {
      const meta = getSectorMeta(sector.sectorCode, sector.sectorName);

      return {
        id: sector.sectorCode,
        name: sector.sectorName || meta.name,
        iconSrc: meta.iconSrc,
        profitAmount: sector.profitAmount,
        profitRate: sector.profitRate,
        investmentAmount: sector.totalInvestment,
        isFallback: sector.isFallback,
      };
    }),
  };
}

function parseInvestmentResultDate(value: string): InvestmentResultDate {
  const [, , month, day] = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value) ?? [];

  if (!month || !day) {
    throw new Error(`투자 통계 기준일 형식이 올바르지 않습니다: ${value}`);
  }

  return {
    month: Number(month),
    day: Number(day),
  };
}

function parseOptionalInvestmentResultDate(
  value: string,
): InvestmentResultDate | null {
  try {
    return parseInvestmentResultDate(value);
  } catch {
    return null;
  }
}

function isTopSectorRank(rank: number): rank is TopSector["rank"] {
  return rank === 1 || rank === 2 || rank === 3;
}

function calculateProfitRate(profitAmount: number, totalInvestment: number) {
  if (totalInvestment === 0) return 0;

  return Number(((profitAmount / totalInvestment) * 100).toFixed(1));
}

function requireStatsHistoryDate(response: StatsHistoryApi) {
  if (!response.date) {
    throw new Error(
      `${response.period} 기간의 조회 기준 date가 누락되었습니다.`,
    );
  }

  return response.date;
}
