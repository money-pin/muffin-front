import { useQuery } from "@tanstack/react-query";

import { getWeeklyRanking } from "./rankingApi";

export const rankingQueryKeys = {
  all: ["ranking"] as const,
  weekly: () => [...rankingQueryKeys.all, "weekly"] as const,
};

export function useWeeklyRankingQuery() {
  return useQuery({
    queryKey: rankingQueryKeys.weekly(),
    queryFn: getWeeklyRanking,
    retry: false,
  });
}
