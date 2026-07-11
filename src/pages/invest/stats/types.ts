export interface InvestmentResultDate {
  month: number;
  day: number;
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

export interface InvestmentProfile {
  type: string;
  description: string;
  details: string[];
}
