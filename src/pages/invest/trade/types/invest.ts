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
  | "DOLLAR"
  | "BONDS"
  | "COIN"
  | "BIOTECH"
  | "SEMICONDUCTOR"
  | "TECHNOLOGY"
  | "ENERGY"
  | "FINANCIALS"
  | "AUTOMOBILE"
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
  assetCardId: number;
  sectorName: string;
  sectorCode: InvestSectorCode;
  etfCode: string;
  etfName: string;
  isActive: boolean;
  iconUrl: string;
}

export interface InvestmentSectorGroup {
  groupName: string;
  sectors: InvestmentSector[];
}

export interface InvestmentSectorsResult {
  unitAmount: number;
  groups: InvestmentSectorGroup[];
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

export interface TodayInvestmentSelection {
  sectorName: string;
  sectorCode: InvestSectorCode;
  quantity: number;
  amount: number;
  percentage: number;
}

export type TodayInvestmentResult =
  | {
      status: "CONFIRMED";
      dailyInvestmentId: number;
      investDate: string;
      totalAmount: number;
      confirmedAt: string;
      deadline: string;
      isEditable: boolean;
      selections: TodayInvestmentSelection[];
    }
  | {
      status: "CLOSED";
      message: string;
    };