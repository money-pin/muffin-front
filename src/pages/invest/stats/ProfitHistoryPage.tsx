import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

import StatsQueryErrorModal from "@/pages/invest/stats/components/StatsQueryErrorModal";
import type { TopBarOutletContext } from "@/layouts/TopBarLayout";
import { useStatsHistoryQuery } from "@/pages/invest/stats/api/queries";
import ProfitHistoryPageSkeleton from "@/pages/invest/stats/components/ProfitHistoryPageSkeleton";
import ProfitHistoryPeriodTabs from "@/pages/invest/stats/components/ProfitHistoryPeriodTabs";
import ProfitHistorySectorSection from "@/pages/invest/stats/components/ProfitHistorySectorSection";
import ProfitHistorySummary from "@/pages/invest/stats/components/ProfitHistorySummary";
import type {
  ProfitHistoryApiPeriod,
  ProfitHistoryData,
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
  const navigate = useNavigate();
  const { setTopBar, resetTopBar } = useOutletContext<TopBarOutletContext>();
  const [period, setPeriod] = useState<ProfitHistoryPeriod>("all");
  const [sortKey, setSortKey] = useState<ProfitHistorySortKey>("RATE_DESC");
  const [selectedDate, setSelectedDate] = useState<string>();
  const [lastHistory, setLastHistory] = useState<ProfitHistoryData>();
  const apiPeriod = UI_PERIOD_TO_API_PERIOD[period];
  const {
    data: profitHistory,
    error: profitHistoryError,
    errorUpdatedAt,
    isError,
    isFetching,
    isLoading,
    isPlaceholderData,
    refetch,
  } = useStatsHistoryQuery({
    period: apiPeriod,
    date: selectedDate,
    sort: sortKey,
  });
  const displayedHistory = profitHistory ?? lastHistory;
  const displayedPeriod = displayedHistory?.period.toLowerCase() as
    ProfitHistoryPeriod | undefined;
  useEffect(() => {
    if (!profitHistory || isPlaceholderData) return;
    let active = true;
    queueMicrotask(() => {
      if (active) setLastHistory(profitHistory);
    });
    return () => {
      active = false;
    };
  }, [profitHistory, isPlaceholderData]);

  const changePeriod = (nextPeriod: ProfitHistoryPeriod) => {
    if (nextPeriod === period && isError) {
      void refetch({ cancelRefetch: false });
      return;
    }
    setPeriod(nextPeriod);
    setSelectedDate(nextPeriod === "day" ? getPreviousKstDate() : undefined);
  };

  const changeSort = (nextSortKey: ProfitHistorySortKey) => {
    const basePeriod = displayedPeriod ?? period;
    const baseDate = displayedHistory?.date;
    if (
      nextSortKey === sortKey &&
      basePeriod === period &&
      baseDate === selectedDate &&
      isError
    ) {
      void refetch({ cancelRefetch: false });
      return;
    }
    setPeriod(basePeriod);
    setSelectedDate(baseDate);
    setSortKey(nextSortKey);
  };

  const movePeriod = (amount: -1 | 1) => {
    // 실패한 요청이 아니라 현재 표시 중인 응답을 기준으로 이동한다.
    const basePeriod = displayedPeriod ?? period;
    const baseDate = displayedHistory?.date;
    if (isFetching || !isDatePeriod(basePeriod) || !baseDate) return;
    const nextDate = shiftProfitHistoryDate(basePeriod, baseDate, amount);
    const nextSort = displayedHistory.sort;
    if (
      basePeriod === period &&
      nextDate === selectedDate &&
      nextSort === sortKey
    ) {
      void refetch({ cancelRefetch: false });
      return;
    }
    setPeriod(basePeriod);
    setSortKey(nextSort);
    setSelectedDate(nextDate);
  };

  useEffect(() => {
    setTopBar({ title: "기간 매매수익률", showBack: true });
    return resetTopBar;
  }, [setTopBar, resetTopBar]);

  return (
    <main
      aria-busy={isFetching}
      className="flex min-h-[calc(100dvh-56px)] flex-col bg-neutral-50"
    >
      <h1 className="sr-only">기간 매매수익률</h1>

      <ProfitHistoryPeriodTabs
        value={displayedPeriod ?? period}
        onChange={changePeriod}
      />

      {isLoading && !displayedHistory && (
        <ProfitHistoryPageSkeleton sortKey={sortKey} />
      )}

      {displayedHistory && (
        <>
          <ProfitHistorySummary
            period={displayedPeriod ?? period}
            data={displayedHistory.summary}
            hasPrev={!isFetching && displayedHistory.hasPrev}
            hasNext={!isFetching && displayedHistory.hasNext}
            onPrev={() => movePeriod(-1)}
            onNext={() => movePeriod(1)}
          />

          {displayedHistory.sectors.length > 0 ? (
            <>
              <div aria-hidden="true" className="h-8 bg-neutral-50" />

              <ProfitHistorySectorSection
                sectors={displayedHistory.sectors}
                sortKey={displayedHistory.sort}
                onSortChange={changeSort}
              />
            </>
          ) : (
            <div aria-hidden="true" className="flex-1 bg-neutral-50" />
          )}
        </>
      )}

      <StatsQueryErrorModal
        error={profitHistoryError}
        errorUpdatedAt={errorUpdatedAt}
        isError={isError}
        isFetching={isFetching}
        hasData={!!displayedHistory}
        onRetry={() => refetch({ cancelRefetch: false })}
        onExit={() => {
          if (window.history.state?.idx > 0) navigate(-1);
          else navigate("/invest/stats", { replace: true });
        }}
      />
    </main>
  );
}
