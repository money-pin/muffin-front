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

export type InvestSectorCode =
  | "DEPOSIT"
  | "GOLD"
  | "BOND"
  | "USD"
  | "TECH"
  | "SEMICONDUCTOR"
  | "BIO"
  | "CRYPTO"
  | "AUTO"
  | "ENERGY"
  | "FINANCE"
  | "DEFENSE";

export interface InvestAssetMeta {
  id: InvestAssetId;
  name: string;
  icon: string;
  activeIcon: string;
  sectorCode: InvestSectorCode;
}

export interface InvestAssetSection {
  id: string;
  title: string;
  items: InvestAssetMeta[];
}

export interface InvestmentSector {
  sectorCode: InvestSectorCode;
  name: string;
  sectorOrder: number;
}

export interface InvestmentSectorGroup {
  groupCode: string;
  groupName: string;
  groupOrder: number;
  sectors: InvestmentSector[];
}

export interface InvestmentSectorsResult {
  unitAmount: number;
  groups: InvestmentSectorGroup[];
}

export type TodayInvestmentStatus =
  | "AVAILABLE"
  | "CONFIRMED"
  | "CLOSED"
  | "BLOCKED"
  | "NO_INVEST"
  | (string & {});

export interface TodayInvestmentSector {
  sectorCode: InvestSectorCode;
  sectorName: string;
  quantity: number;
  amount: number;
  ratio: number;
}

export interface TodayInvestmentResult {
  status: TodayInvestmentStatus;
  confirmDeadline: string;
  remainingAmount: number;
  totalAmount: number;
  sectors: TodayInvestmentSector[];
  nextInvestmentAvailableAt: string;
}

export interface InvestmentSelectionRequest {
  assetCardId: number;
  quantity: number;
}

export interface ConfirmInvestmentRequest {
  selections: InvestmentSelectionRequest[];
}

export interface ConfirmInvestmentResult {
  dailyInvestmentId: number;
  investDate: string;
  totalAmount: number;
  confirmedAt: string;
  selections: {
    sectorName: string;
    quantity: number;
    amount: number;
  }[];
}