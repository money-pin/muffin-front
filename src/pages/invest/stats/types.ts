export interface InvestmentResultDate {
  month: number;
  day: number;
}

export type ProfitHistoryPeriod = "day" | "week" | "month" | "year" | "all";

export type ProfitHistoryApiPeriod = "DAY" | "WEEK" | "MONTH" | "YEAR" | "ALL";

export type ProfitHistorySortKey =
  "AMOUNT_DESC" | "AMOUNT_ASC" | "RATE_DESC" | "RATE_ASC";

export interface ProfitHistorySummary {
  title: string;
  profitAmount: number;
  profitRate: number;
  investmentAmount: number;
}

export interface ProfitHistorySector {
  sectorCode: string;
  name: string;
  iconSrc: string;
  profitAmount: number;
  profitRate: number;
  investmentAmount: number;
}

export interface ProfitHistoryData {
  period: ProfitHistoryApiPeriod;
  date?: string;
  hasPrev: boolean;
  hasNext: boolean;
  summary: ProfitHistorySummary;
  sort: ProfitHistorySortKey;
  sectors: ProfitHistorySector[];
}

export interface RecentPerformanceSummary {
  date: InvestmentResultDate;
  profitAmount: number;
  profitRate: number;
  investmentAmount: number;
}

export interface CumulativeProfit {
  amount: number;
  rate: number;
}

export interface ProfitTrendPoint {
  label: string;
  value: number;
}

export interface TopSector {
  rank: 1 | 2 | 3;
  name: string;
  profitAmount: number;
  profitRate: number;
}

export interface SectorPerformanceDetail {
  id: string;
  name: string;
  iconSrc: string;
  profitAmount: number;
  profitRate: number;
  investmentAmount: number;
}

export interface InvestmentProfile {
  type: string;
  description: string;
  details: string[];
}

export interface StatsSummaryData {
  investDate?: InvestmentResultDate;
  cumulativeProfit: CumulativeProfit;
  trend: ProfitTrendPoint[];
  topSectors: TopSector[];
  profile?: InvestmentProfile;
}
