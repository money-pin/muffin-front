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

export default function ProfitHistoryPage() {
  const { setTopBar, resetTopBar } = useOutletContext<TopBarOutletContext>();
  const [period, setPeriod] = useState<ProfitHistoryPeriod>("month");
  const [sortKey, setSortKey] = useState<ProfitHistorySortKey>("RATE_DESC");

  const currentData = profitHistoryMock[period];

  useEffect(() => {
    setTopBar({ title: "누적 수익 내역", showBack: true });
    return resetTopBar;
  }, [setTopBar, resetTopBar]);

  return (
    <main className="min-h-[calc(100dvh-118px)] bg-neutral-50">
      <h1 className="sr-only">누적 수익 내역</h1>

      <ProfitHistoryPeriodTabs value={period} onChange={setPeriod} />

      <ProfitHistorySummary
        period={period}
        data={currentData.summary}
        hasPrev={currentData.hasPrev}
        hasNext={currentData.hasNext}
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
