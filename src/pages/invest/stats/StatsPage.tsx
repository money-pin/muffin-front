import { useState } from "react";
import { useNavigate } from "react-router-dom";

import BottomSheet from "@/components/common/BottomSheet";

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
import { statsMock } from "@/pages/invest/stats/mocks/statsMock";

export default function StatsPage() {
  const navigate = useNavigate();
  const [isRecentPerformanceOpen, setIsRecentPerformanceOpen] = useState(false);
  const { data: statsSummary, isLoading: isStatsSummaryLoading } =
    useStatsSummaryQuery();
  const {
    data: recentPerformanceDetail,
    isError: isRecentPerformanceError,
    isLoading: isRecentPerformanceLoading,
  } = useStatsRecentDetailQuery(isRecentPerformanceOpen);

  const statsData = statsSummary ?? {
    investDate: statsMock.recentPerformance.date,
    cumulativeProfit: statsMock.cumulativeProfit,
    trend: statsMock.trend,
    topSectors: statsMock.topSectors,
    profile: statsMock.profile,
  };

  if (isStatsSummaryLoading) {
    return <StatsPageSkeleton />;
  }

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
