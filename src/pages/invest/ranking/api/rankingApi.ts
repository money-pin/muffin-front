import { apiRequest } from "@/lib/api";

import type { WeeklyRankingApi } from "./apiTypes";
import { mapWeeklyRankingApiToData } from "./mappers";

export async function getWeeklyRanking() {
  const response = await apiRequest<WeeklyRankingApi>("/api/rankings/weekly", {
    auth: true,
  });

  return mapWeeklyRankingApiToData(response);
}
