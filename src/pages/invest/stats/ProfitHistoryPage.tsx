import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";

import type { TopBarOutletContext } from "@/layouts/TopBarLayout";
import ProfitHistoryPeriodTabs from "@/pages/invest/stats/components/ProfitHistoryPeriodTabs";
import ProfitHistoryPageSkeleton from "@/pages/invest/stats/components/ProfitHistoryPageSkeleton";
import ProfitHistorySectorSection from "@/pages/invest/stats/components/ProfitHistorySectorSection";
import ProfitHistorySummary from "@/pages/invest/stats/components/ProfitHistorySummary";
import { useStatsHistoryQuery } from "@/pages/invest/stats/api/queries";
import type {
  ProfitHistoryApiPeriod,
  ProfitHistoryPeriod,
  ProfitHistorySortKey,
} from "@/pages/invest/stats/types";
import { shiftProfitHistoryDate } from "@/pages/invest/stats/utils/profitHistoryDate";

type DatePeriod = Exclude<ProfitHistoryPeriod, "all">;

const UI_PERIOD_TO_API_PERIOD = {
  day: "DAY",
  week: "WEEK",
  month: "MONTH",
  year: "YEAR",
  all: "ALL",
} satisfies Record<ProfitHistoryPeriod, ProfitHistoryApiPeriod>;

function isDatePeriod(period: ProfitHistoryPeriod): period is DatePeriod {
  return period !== "all";
}

export default function ProfitHistoryPage() {
  const { setTopBar, resetTopBar } = useOutletContext<TopBarOutletContext>();
  const [period, setPeriod] = useState<ProfitHistoryPeriod>("month");
  const [sortKey, setSortKey] = useState<ProfitHistorySortKey>("RATE_DESC");
  const [selectedDate, setSelectedDate] = useState<string>();
  const apiPeriod = UI_PERIOD_TO_API_PERIOD[period];
  const {
    data: profitHistory,
    isError,
    isLoading,
  } = useStatsHistoryQuery({
    period: apiPeriod,
    date: selectedDate,
    sort: sortKey,
  });

  const changePeriod = (nextPeriod: ProfitHistoryPeriod) => {
    setPeriod(nextPeriod);
    setSelectedDate(undefined);
  };

  const changeSort = (nextSortKey: ProfitHistorySortKey) => {
    setSortKey(nextSortKey);
  };

  const movePeriod = (amount: -1 | 1) => {
    const baseDate = selectedDate ?? profitHistory?.date;
    if (!isDatePeriod(period) || !baseDate) return;

    setSelectedDate(shiftProfitHistoryDate(period, baseDate, amount));
  };

  useEffect(() => {
    setTopBar({ title: "누적 수익 내역", showBack: true });
    return resetTopBar;
  }, [setTopBar, resetTopBar]);

  return (
    <main className="flex min-h-[calc(100dvh-56px)] flex-col bg-neutral-50">
      <h1 className="sr-only">누적 수익 내역</h1>

      <ProfitHistoryPeriodTabs value={period} onChange={changePeriod} />

      {isLoading && <ProfitHistoryPageSkeleton sortKey={sortKey} />}

      {isError && !isLoading && (
        <p className="text-body-14-md px-5 py-10 text-center text-neutral-500">
          누적 수익 내역을 불러오지 못했습니다.
        </p>
      )}

      {profitHistory && !isLoading && !isError && (
        <>
          <ProfitHistorySummary
            period={period}
            data={profitHistory.summary}
            hasPrev={profitHistory.hasPrev}
            hasNext={profitHistory.hasNext}
            onPrev={() => movePeriod(-1)}
            onNext={() => movePeriod(1)}
          />

          {profitHistory.sectors.length > 0 ? (
            <>
              <div aria-hidden="true" className="h-8 bg-neutral-50" />

              <ProfitHistorySectorSection
                sectors={profitHistory.sectors}
                sortKey={sortKey}
                onSortChange={changeSort}
              />
            </>
          ) : (
            <div aria-hidden="true" className="flex-1 bg-neutral-50" />
          )}
        </>
      )}
    </main>
  );
}
