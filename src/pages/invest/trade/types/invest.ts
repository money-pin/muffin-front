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
  | "CONFIRMED_EDITABLE"
  | "UNAVAILABLE"
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

// 실제 API는 UNAVAILABLE 등 일부 상태에서 내역/금액 필드를 생략할 수 있음
export interface TodayInvestmentResult {
  status: TodayInvestmentStatus;
  confirmDeadline?: string;
  remainingAmount?: number;
  totalAmount?: number;
  sectors?: TodayInvestmentSector[];
  nextInvestmentAvailableAt?: string;
}

export interface InvestmentSelectionRequest {
  sectorCode: InvestSectorCode;
  quantity: number;
}

export interface ConfirmInvestmentRequest {
  sectors: InvestmentSelectionRequest[];
}

// 확정/수정 API 응답은 오늘 투자 현황 조회 응답과 구조가 다름
export interface ConfirmInvestmentResult {
  dailyInvestmentId: number;
  investDate: string;
  totalAmount: number;
  confirmedAt: string;
  selections: {
    sectorCode?: InvestSectorCode;
    sectorName: string;
    quantity: number;
    amount: number;
  }[];
}