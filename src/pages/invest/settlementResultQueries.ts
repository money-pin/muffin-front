import { useQuery } from "@tanstack/react-query";

import { getSettlementResult } from "@/pages/invest/settlementResultApi";
import { getAccountId, getAuthSessionRevision } from "@/lib/auth";

export const settlementResultQueryKeys = {
  all: ["settlement-result"] as const,
  result: (accountId: string | null, revision: number) =>
    [...settlementResultQueryKeys.all, "result", accountId, revision] as const,
};

export function useSettlementResultQuery(accountId: string | null) {
  const revision = getAuthSessionRevision();
  return useQuery({
    queryKey: settlementResultQueryKeys.result(accountId, revision),
    queryFn: async () => {
      const isCurrentSession = () =>
        accountId !== null &&
        getAccountId() === accountId &&
        getAuthSessionRevision() === revision;
      if (!isCurrentSession()) throw new Error("Settlement session changed");
      const result = await getSettlementResult();
      if (!isCurrentSession()) throw new Error("Settlement session changed");
      return result;
    },
    enabled: accountId !== null,
    retry: false,
  });
}
