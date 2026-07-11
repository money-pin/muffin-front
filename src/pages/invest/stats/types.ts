export interface InvestmentResultDate {
  month: number;
  day: number;
}

export type ProfitHistoryPeriod = "day" | "week" | "month" | "year" | "all";

export interface ProfitHistorySummary {
  title: string;
  profitAmount: number;
  profitRate: number;
  investmentAmount: number;
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
