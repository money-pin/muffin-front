import { useQuery } from "@tanstack/react-query";

import { getStatsSummary } from "./statsApi";

// 투자 통계 API 캐시 키와 조회 hook을 관리합니다
export const statsQueryKeys = {
  all: ["stats"] as const,
  summary: () => [...statsQueryKeys.all, "summary"] as const,
};

export function useStatsSummaryQuery() {
  return useQuery({
    queryKey: statsQueryKeys.summary(),
    queryFn: getStatsSummary,
    retry: false,
  });
}
