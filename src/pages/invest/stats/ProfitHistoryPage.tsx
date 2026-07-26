import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";

import type { TopBarOutletContext } from "@/layouts/TopBarLayout";
import ProfitHistoryPeriodTabs from "@/pages/invest/stats/components/ProfitHistoryPeriodTabs";
import ProfitHistorySectorSection from "@/pages/invest/stats/components/ProfitHistorySectorSection";
import ProfitHistorySummary from "@/pages/invest/stats/components/ProfitHistorySummary";
import { profitHistoryMock } from "@/pages/invest/stats/mocks/profitHistoryMock";
import type {
  ProfitHistoryPeriod,
  ProfitHistorySortKey,
} from "@/pages/invest/stats/types";
import {
  formatProfitHistoryTitle,
  shiftProfitHistoryDate,
} from "@/pages/invest/stats/utils/profitHistoryDate";

type DatePeriod = Exclude<ProfitHistoryPeriod, "all">;

function getInitialDate(period: DatePeriod) {
  const date = profitHistoryMock[period].date;
  if (!date) throw new Error(`${period} 기간의 초기 날짜가 누락되었습니다.`);

  return date;
}

const initialDates: Record<DatePeriod, string> = {
  day: getInitialDate("day"),
  week: getInitialDate("week"),
  month: getInitialDate("month"),
  year: getInitialDate("year"),
};

export default function ProfitHistoryPage() {
  const { setTopBar, resetTopBar } = useOutletContext<TopBarOutletContext>();
  const [period, setPeriod] = useState<ProfitHistoryPeriod>("month");
  const [sortKey, setSortKey] = useState<ProfitHistorySortKey>("RATE_DESC");
  const [dates, setDates] = useState(initialDates);

  const currentData = profitHistoryMock[period];
  const hasNext = period !== "all" && dates[period] !== initialDates[period];
  const summary = {
    ...currentData.summary,
    title:
      period === "all"
        ? formatProfitHistoryTitle("all")
        : formatProfitHistoryTitle(period, dates[period]),
  };

  const movePeriod = (amount: -1 | 1) => {
    if (period === "all") return;

    setDates((current) => ({
      ...current,
      [period]: shiftProfitHistoryDate(period, current[period], amount),
    }));
  };

  useEffect(() => {
    setTopBar({ title: "누적 수익 내역", showBack: true });
    return resetTopBar;
  }, [setTopBar, resetTopBar]);

  return (
    <main className="min-h-[calc(100dvh-56px)] bg-neutral-50">
      <h1 className="sr-only">누적 수익 내역</h1>

      <ProfitHistoryPeriodTabs value={period} onChange={setPeriod} />

      <ProfitHistorySummary
        period={period}
        data={summary}
        hasPrev={currentData.hasPrev}
        hasNext={hasNext}
        onPrev={() => movePeriod(-1)}
        onNext={() => movePeriod(1)}
      />

      <div aria-hidden="true" className="h-8 bg-neutral-50" />

      <ProfitHistorySectorSection
        sectors={currentData.sectors}
        sortKey={sortKey}
        onSortChange={setSortKey}
      />
    </main>
  );
}
