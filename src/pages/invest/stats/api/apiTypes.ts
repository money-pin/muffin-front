import type {
  ProfitHistoryApiPeriod,
  ProfitHistorySortKey,
} from "@/pages/invest/stats/types";

export interface StatsSummaryApi {
  investDate?: string;
  cumulativeProfitAmount: number;
  cumulativeProfitRate: number;
  graph: StatsSummaryGraphPointApi[];
  topSectors: StatsSummaryTopSectorApi[];
  investmentType?: StatsSummaryInvestmentTypeApi;
}

export interface StatsSummaryGraphPointApi {
  date: string;
  cumulativeProfitRate: number;
}

export interface StatsSummaryTopSectorApi {
  rank: number;
  sectorCode: string;
  sectorName: string;
  profitAmount: number;
  profitRate: number;
}

export interface StatsSummaryInvestmentTypeApi {
  type: string;
  label: string;
  description: string;
  bullets: string[];
}

export interface StatsHistoryApi {
  period: ProfitHistoryApiPeriod;
  date?: string;
  hasPrev: boolean;
  hasNext: boolean;
  summary: StatsHistorySummaryApi;
  sort: ProfitHistorySortKey;
  sectors: StatsHistorySectorApi[];
}

export interface StatsHistorySummaryApi {
  profitAmount: number;
  profitRate: number;
  totalInvestment: number;
}

export interface StatsHistorySectorApi {
  sectorCode: string;
  sectorName: string;
  profitAmount: number;
  profitRate: number;
  totalInvestment: number;
}

export interface StatsRecentDetailApi {
  date: string | null;
  totalInvestment: number;
  profitAmount: number;
  sectors: StatsRecentDetailSectorApi[];
}

export interface StatsRecentDetailSectorApi {
  sectorCode: string;
  sectorName: string;
  profitAmount: number;
  profitRate: number;
  totalInvestment: number;
  isFallback: boolean;
}
