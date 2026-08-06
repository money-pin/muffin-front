import { useQuery } from "@tanstack/react-query";

import { getSettlementResult } from "@/pages/invest/settlementResultApi";

export const settlementResultQueryKeys = {
  all: ["settlement-result"] as const,
  result: () => [...settlementResultQueryKeys.all, "result"] as const,
};

export function useSettlementResultQuery() {
  return useQuery({
    queryKey: settlementResultQueryKeys.result(),
    queryFn: getSettlementResult,
    retry: false,
  });
}
