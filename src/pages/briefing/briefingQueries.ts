import { useMutation, useQuery } from "@tanstack/react-query";

import {
  getBriefing,
  getTodayBriefing,
  recordBriefingView,
} from "@/lib/briefingApi";

export const briefingKeys = {
  all: ["briefing"] as const,
  today: () => ["briefing", "today"] as const,
  date: (briefingDate: string) => ["briefing", "date", briefingDate] as const,
};

// 날짜가 없으면 오늘의 브리핑, 있으면 해당 날짜 브리핑 (알림 딥링크)
export function useBriefing(briefingDate?: string) {
  return useQuery({
    queryKey: briefingDate
      ? briefingKeys.date(briefingDate)
      : briefingKeys.today(),
    queryFn: () =>
      briefingDate ? getBriefing(briefingDate) : getTodayBriefing(),
  });
}

export function useRecordBriefingView() {
  return useMutation({ mutationFn: recordBriefingView });
}
