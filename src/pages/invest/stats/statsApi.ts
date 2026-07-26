import { apiRequest } from "@/lib/api";

import type { StatsSummaryApi } from "./apiTypes";
import { mapStatsSummaryToStatsSummaryData } from "./mappers";

export async function getStatsSummary() {
  const response = await apiRequest<StatsSummaryApi>("/api/stats/summary", {
    auth: true,
  });

  return mapStatsSummaryToStatsSummaryData(response);
}
