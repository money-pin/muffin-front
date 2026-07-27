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

/**
 * 아래 confirm/today 타입은 다음 이슈에서 Swagger 기준으로 다시 정리할 예정.
 * 이슈 1에서는 getInvestmentSectors 타입만 실제 응답 기준으로 사용.
 */
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

export interface TodayInvestmentSector {
  sectorCode: InvestSectorCode;
  sectorName: string;
  quantity: number;
  amount: number;
  ratio: number;
}

export interface TodayInvestmentResult {
  status: string;
  confirmDeadline: string;
  remainingAmount: number;
  totalAmount: number;
  sectors: TodayInvestmentSector[];
  nextInvestmentAvailableAt: string;
}