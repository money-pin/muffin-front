import { useQuery } from "@tanstack/react-query";

import { getInvestmentAsset } from "@/pages/invest/investmentAssetApi";

export const investmentAssetQueryKeys = {
  all: ["investment-asset"] as const,
  asset: () => [...investmentAssetQueryKeys.all, "asset"] as const,
};

export function useInvestmentAssetQuery() {
  return useQuery({
    queryKey: investmentAssetQueryKeys.asset(),
    queryFn: getInvestmentAsset,
    retry: false,
  });
}