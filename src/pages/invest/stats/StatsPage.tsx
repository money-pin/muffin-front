import { useState } from "react";
import { useNavigate } from "react-router-dom";

import BottomSheet from "@/components/common/BottomSheet";

import InvestmentStyleCard from "@/pages/invest/stats/components/InvestmentStyleCard";
import ProfitRateTrendCard from "@/pages/invest/stats/components/ProfitRateTrendCard";
import RecentPerformanceCard from "@/pages/invest/stats/components/RecentPerformanceCard";
import RecentPerformanceSheetContent from "@/pages/invest/stats/components/RecentPerformanceSheetContent";
import TopProfitSectorsCard from "@/pages/invest/stats/components/TopProfitSectorsCard";
import TotalProfitCard from "@/pages/invest/stats/components/TotalProfitCard";
import { statsMock } from "@/pages/invest/stats/mocks/statsMock";

export default function StatsPage() {
  const navigate = useNavigate();
  const [isRecentPerformanceOpen, setIsRecentPerformanceOpen] = useState(false);

  return (
    <>
      <main className="flex flex-col gap-3 bg-neutral-50 px-5 pt-6 pb-24">
        <RecentPerformanceCard
          date={statsMock.recentPerformance.date}
          onClick={() => setIsRecentPerformanceOpen(true)}
        />
        <TotalProfitCard
          data={statsMock.cumulativeProfit}
          onClick={() => navigate("/invest/profit-history")}
        />
        <ProfitRateTrendCard data={statsMock.trend} />
        <TopProfitSectorsCard sectors={statsMock.topSectors} />
        <InvestmentStyleCard profile={statsMock.profile} />
      </main>

      <BottomSheet
        isOpen={isRecentPerformanceOpen}
        onClose={() => setIsRecentPerformanceOpen(false)}
        ariaLabel="최근 투자 성과 상세"
        snapMode="half-full"
      >
        <RecentPerformanceSheetContent
          summary={statsMock.recentPerformance}
          sectors={statsMock.sectorDetails}
        />
      </BottomSheet>
    </>
  );
}
