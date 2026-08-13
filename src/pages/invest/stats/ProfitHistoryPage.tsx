import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";

import ErrorModal from "@/components/common/ErrorModal";
import type { TopBarOutletContext } from "@/layouts/TopBarLayout";
import { DEFAULT_ERROR_MESSAGE } from "@/lib/errorMessages";
import { useApiErrorModal } from "@/lib/useApiErrorModal";
import { useStatsHistoryQuery } from "@/pages/invest/stats/api/queries";
import ProfitHistoryPageSkeleton from "@/pages/invest/stats/components/ProfitHistoryPageSkeleton";
import ProfitHistoryPeriodTabs from "@/pages/invest/stats/components/ProfitHistoryPeriodTabs";
import ProfitHistorySectorSection from "@/pages/invest/stats/components/ProfitHistorySectorSection";
import ProfitHistorySummary from "@/pages/invest/stats/components/ProfitHistorySummary";
import type {
  ProfitHistoryApiPeriod,
  ProfitHistoryPeriod,
  ProfitHistorySortKey,
} from "@/pages/invest/stats/types";
import {
  getPreviousKstDate,
  shiftProfitHistoryDate,
} from "@/pages/invest/stats/utils/profitHistoryDate";

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
  const [period, setPeriod] = useState<ProfitHistoryPeriod>("all");
  const [sortKey, setSortKey] = useState<ProfitHistorySortKey>("RATE_DESC");
  const [selectedDate, setSelectedDate] = useState<string>();
  const apiPeriod = UI_PERIOD_TO_API_PERIOD[period];
  const {
    data: profitHistory,
    error: profitHistoryError,
    isError,
    isFetching,
    isLoading,
    refetch,
  } = useStatsHistoryQuery({
    period: apiPeriod,
    date: selectedDate,
    sort: sortKey,
  });
  const { error, showError, closeError, handlePrimaryAction } =
    useApiErrorModal({
      onRetry: () => {
        void refetch();
      },
    });

  const changePeriod = (nextPeriod: ProfitHistoryPeriod) => {
    setPeriod(nextPeriod);
    setSelectedDate(nextPeriod === "day" ? getPreviousKstDate() : undefined);
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

  useEffect(() => {
    if (!isError) return;

    queueMicrotask(() => {
      showError(profitHistoryError);
    });
  }, [isError, profitHistoryError, showError]);

  return (
    <main className="flex min-h-[calc(100dvh-56px)] flex-col bg-neutral-50">
      <h1 className="sr-only">누적 수익 내역</h1>

      <ProfitHistoryPeriodTabs value={period} onChange={changePeriod} />

      {isLoading && <ProfitHistoryPageSkeleton sortKey={sortKey} />}

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

      {isError && !isLoading && (
        <ErrorModal
          isOpen={!!error}
          info={error?.info ?? DEFAULT_ERROR_MESSAGE}
          onPrimaryAction={handlePrimaryAction}
          onSecondaryAction={closeError}
          onClose={closeError}
          isLoading={isFetching}
        />
      )}
    </main>
  );
}
