import { apiRequest } from "@/lib/api";

// 정산 결과 없음 사유. reason이 있으면 표시할 결과가 없는 것으로 간주한다.
// (NO_INVESTMENT: 투자/정산 내역 없음, SETTLEMENT_PENDING: 정산 진행 중)
export type SettlementNoResultReason = "NO_INVESTMENT" | "SETTLEMENT_PENDING";

// GET /api/investments/settlement/result 원본 응답
export interface SettlementResultApi {
  investDate: string | null;
  totalProfitLoss: number;
  totalProfitLossRate: number;
  totalAmount: number;
  totalAsset: number;
  reason: SettlementNoResultReason | null;
}

// 홈 투자 결과 모달이 사용하는 UI 모델
export interface SettlementResult {
  date: string;
  profit: number;
  profitRate: number;
  principal: number;
  finalAssets: number;
}

// 정산 완료(SETTLED)면 결과를, 그 외(reason 존재)엔 null을 반환한다.
export async function getSettlementResult(): Promise<SettlementResult | null> {
  const response = await apiRequest<SettlementResultApi>(
    "/api/investments/settlement/result",
    { auth: true },
  );

  if (response.reason || !response.investDate) return null;

  return {
    date: response.investDate.replace(/-/g, "."),
    profit: response.totalProfitLoss,
    profitRate: response.totalProfitLossRate,
    principal: response.totalAmount,
    finalAssets: response.totalAsset,
  };
}
