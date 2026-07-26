import { useQuery } from "@tanstack/react-query";

import {
  getStatsHistory,
  getStatsSummary,
  type StatsHistoryParams,
} from "./statsApi";

// 투자 통계 API 캐시 키와 조회 hook을 한 곳에서 관리합니다.
export const statsQueryKeys = {
  all: ["stats"] as const,
  summary: () => [...statsQueryKeys.all, "summary"] as const,
  history: (params: StatsHistoryParams) =>
    [...statsQueryKeys.all, "history", params] as const,
};

export function useStatsSummaryQuery() {
  return useQuery({
    queryKey: statsQueryKeys.summary(),
    queryFn: getStatsSummary,
    retry: false,
  });
}

export function useStatsHistoryQuery(params: StatsHistoryParams) {
  return useQuery({
    queryKey: statsQueryKeys.history(params),
    queryFn: () => getStatsHistory(params),
    retry: false,
  });
}
