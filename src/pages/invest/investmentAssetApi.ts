import { apiRequest } from "@/lib/api";

import type { InvestmentAssetResult } from "@/types/invest";

export function getInvestmentAsset() {
  return apiRequest<InvestmentAssetResult>("/api/investments/asset", {
    method: "GET",
    auth: true,
  });
}