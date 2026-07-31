import { useState } from "react";
import { useNavigate } from "react-router-dom";

import BottomSheet from "@/components/common/BottomSheet";
import ErrorRetryModal from "@/components/common/ErrorRetryModal";

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
    isError: isStatsSummaryError,
    isFetching: isStatsSummaryFetching,
    isLoading: isStatsSummaryLoading,
    refetch: refetchStatsSummary,
  } = useStatsSummaryQuery();
  const {
    data: recentPerformanceDetail,
    isError: isRecentPerformanceError,
    isLoading: isRecentPerformanceLoading,
  } = useStatsRecentDetailQuery(isRecentPerformanceOpen);

  if (isStatsSummaryLoading) {
    return <StatsPageSkeleton />;
  }

  if (isStatsSummaryError || !statsSummary) {
    return (
      <>
        <main className="min-h-[calc(100dvh-220px)] bg-neutral-50 px-5 pt-6 pb-24" />
        <ErrorRetryModal
          isOpen
          onRetry={() => {
            void refetchStatsSummary();
          }}
          isRetrying={isStatsSummaryFetching}
        />
      </>
    );
  }

  const statsData = statsSummary;

  return (
    <>
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
        <ProfitRateTrendCard
          data={statsData.trend}
          isEmpty={!statsData.investDate}
        />
        <TopProfitSectorsCard sectors={statsData.topSectors} />
        {statsData.profile && (
          <InvestmentStyleCard profile={statsData.profile} />
        )}
      </main>

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
          isError={isRecentPerformanceError}
        />
      </BottomSheet>
    </>
  );
}
