import { apiRequest } from "@/lib/api";

import type {
  StatsHistoryApi,
  StatsRecentDetailApi,
  StatsSummaryApi,
} from "./apiTypes";
import {
  mapStatsHistoryToProfitHistoryData,
  mapStatsRecentDetailToRecentPerformanceDetailData,
  mapStatsSummaryToStatsSummaryData,
} from "./mappers";
import type { ProfitHistoryApiPeriod, ProfitHistorySortKey } from "../types";

export interface StatsHistoryParams {
  period: ProfitHistoryApiPeriod;
  date?: string;
  sort?: ProfitHistorySortKey;
}

export async function getStatsSummary() {
  const response = await apiRequest<StatsSummaryApi>("/api/stats/summary", {
    auth: true,
  });

  return mapStatsSummaryToStatsSummaryData(response);
}

export async function getStatsHistory({
  period,
  date,
  sort = "RATE_DESC",
}: StatsHistoryParams) {
  const searchParams = new URLSearchParams({
    period,
    sort,
  });

  if (period !== "ALL" && date) {
    searchParams.set("date", date);
  }

  const response = await apiRequest<StatsHistoryApi>(
    `/api/stats/history?${searchParams.toString()}`,
    { auth: true },
  );

  return mapStatsHistoryToProfitHistoryData(response);
}

export async function getStatsRecentDetail() {
  const response = await apiRequest<StatsRecentDetailApi>("/api/stats/recent", {
    auth: true,
  });

  return mapStatsRecentDetailToRecentPerformanceDetailData(response);
}
