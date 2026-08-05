export type InvestAssetId =
  | "deposit"
  | "gold"
  | "dollar"
  | "bonds"
  | "coin"
  | "biotech"
  | "semiconductor"
  | "technology"
  | "energy"
  | "financials"
  | "automobile"
  | "defense";

export type InvestAssetCardStatus = "default" | "selected" | "purchased";

export interface InvestAssetMeta {
  id: InvestAssetId;
  name: string;
  icon: string;
  activeIcon: string;
}

export interface InvestAssetSection {
  id: string;
  title: string;
  items: InvestAssetMeta[];
}

export type InvestmentAssetChangeDirection =
  "UP" | "DOWN" | "FLAT" | "NONE" | (string & {});

export interface InvestmentAssetResult {
  totalAsset: number;
  dailyChangeAmount: number;
  dailyChangeRate: number;
  changeDirection: InvestmentAssetChangeDirection;
  settlementPending: boolean;
}
