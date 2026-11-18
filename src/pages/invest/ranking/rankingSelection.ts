import type { WeeklyRankingData } from "./api/mappers";
import type { WeeklyRankingItem } from "./types";

export interface RankingSelection {
  weekKey: string;
  user: WeeklyRankingItem;
}

export function resolveRankingSelection(
  data: WeeklyRankingData | undefined,
  selection: RankingSelection | null,
) {
  if (!selection || selection.weekKey !== data?.weekKey) {
    return null;
  }
  // 확정된 주차의 랭킹은 바뀌지 않으므로 선택 당시 항목을 유지한다.
  return selection.user;
}
