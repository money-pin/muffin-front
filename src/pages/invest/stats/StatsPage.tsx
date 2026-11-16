import { useState } from "react";
import { useNavigate } from "react-router-dom";

import BottomSheet from "@/components/common/BottomSheet";
import StatsQueryErrorModal from "@/pages/invest/stats/components/StatsQueryErrorModal";

import {
  useStatsRecentDetailQuery,
  useStatsSummaryQuery,
} from "@/pages/invest/stats/api/queries";
import InvestmentStyleCard from "@/pages/invest/stats/components/InvestmentStyleCard";
import ProfitRateTrendCard from "@/pages/invest/stats/components/ProfitRateTrendCard";
import RecentPerformanceCard from "@/pages/invest/stats/components/RecentPerformanceCard";
import RecentPerformanceSheetContent from "@/pages/invest/stats/components/RecentPerformanceSheetContent";
import StatsPageSkeleton from "@/pages/invest/stats/components/StatsPageSkeleton";
import TopProfitSectorsCard from "@/pages/invest/stats/components/TopProfitSectorsCard";
import TotalProfitCard from "@/pages/invest/stats/components/TotalProfitCard";

export default function StatsPage() {
  const navigate = useNavigate();
  const [isRecentPerformanceOpen, setIsRecentPerformanceOpen] = useState(false);
  const {
    data: statsSummary,
    error: statsSummaryError,
    errorUpdatedAt: statsSummaryErrorUpdatedAt,
    isError: isStatsSummaryError,
    isFetching: isStatsSummaryFetching,
    isLoading: isStatsSummaryLoading,
    refetch: refetchStatsSummary,
  } = useStatsSummaryQuery();
  const {
    data: recentPerformanceDetail,
    error: recentPerformanceError,
    errorUpdatedAt: recentPerformanceErrorUpdatedAt,
    isError: isRecentPerformanceError,
    isFetching: isRecentPerformanceFetching,
    isLoading: isRecentPerformanceLoading,
    refetch: refetchRecentPerformance,
  } = useStatsRecentDetailQuery(isRecentPerformanceOpen);

  const statsData = statsSummary;

  return (
    <>
      {isStatsSummaryLoading && !statsData ? (
        <StatsPageSkeleton />
      ) : statsData ? (
        <main className="flex flex-col gap-3 bg-neutral-50 px-5 pt-6 pb-24">
          {statsData.investDate && (
            <RecentPerformanceCard
              date={statsData.investDate}
              onClick={() => setIsRecentPerformanceOpen(true)}
            />
          )}
          <TotalProfitCard
            data={statsData.cumulativeProfit}
            onClick={() => navigate("/invest/profit-history")}
          />
          <ProfitRateTrendCard data={statsData.trend} />
          <TopProfitSectorsCard sectors={statsData.topSectors} />
          {statsData.profile && (
            <InvestmentStyleCard profile={statsData.profile} />
          )}
        </main>
      ) : (
        <main className="min-h-[calc(100dvh-220px)] bg-neutral-50 px-5 pt-6 pb-24" />
      )}

      <BottomSheet
        isOpen={isRecentPerformanceOpen}
        onClose={() => setIsRecentPerformanceOpen(false)}
        ariaLabel="최근 투자 성과 상세"
        snapMode="half-full"
      >
        <RecentPerformanceSheetContent
          summary={recentPerformanceDetail?.summary}
          sectors={recentPerformanceDetail?.sectors ?? []}
          isLoading={isRecentPerformanceLoading}
          isError={isRecentPerformanceError && !recentPerformanceDetail}
        />
      </BottomSheet>
      <StatsQueryErrorModal
        error={statsSummaryError}
        errorUpdatedAt={statsSummaryErrorUpdatedAt}
        isError={isStatsSummaryError}
        isFetching={isStatsSummaryFetching}
        hasData={!!statsSummary}
        enabled={!isRecentPerformanceOpen}
        onRetry={() => refetchStatsSummary({ cancelRefetch: false })}
      />
      <StatsQueryErrorModal
        error={recentPerformanceError}
        errorUpdatedAt={recentPerformanceErrorUpdatedAt}
        isError={isRecentPerformanceError}
        isFetching={isRecentPerformanceFetching}
        hasData={!!recentPerformanceDetail}
        enabled={isRecentPerformanceOpen}
        onRetry={() => refetchRecentPerformance({ cancelRefetch: false })}
        onExit={() => setIsRecentPerformanceOpen(false)}
      />
    </>
  );
}
