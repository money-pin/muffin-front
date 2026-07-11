import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";

import type { TopBarOutletContext } from "@/layouts/TopBarLayout";
import ProfitHistoryPeriodTabs from "@/pages/invest/stats/components/ProfitHistoryPeriodTabs";
import ProfitHistorySummary from "@/pages/invest/stats/components/ProfitHistorySummary";
import type { ProfitHistoryPeriod } from "@/pages/invest/stats/types";

const PROFIT_HISTORY_SUMMARY_MOCK = {
  day: {
    title: "6월 21일 수익률",
    profitAmount: 1035000,
    profitRate: 5.3,
    investmentAmount: 135700000,
  },
  week: {
    title: "6월 3주차 수익률",
    profitAmount: 1035000,
    profitRate: 5.3,
    investmentAmount: 135700000,
  },
  month: {
    title: "6월 수익률",
    profitAmount: 1035000,
    profitRate: 5.3,
    investmentAmount: 135700000,
  },
  year: {
    title: "26년도 수익률",
    profitAmount: 1035000,
    profitRate: 5.3,
    investmentAmount: 135700000,
  },
  all: {
    title: "총 누적 수익률",
    profitAmount: 1035000,
    profitRate: 5.3,
    investmentAmount: 135700000,
  },
} satisfies Record<
  ProfitHistoryPeriod,
  {
    title: string;
    profitAmount: number;
    profitRate: number;
    investmentAmount: number;
  }
>;

export default function ProfitHistoryPage() {
  const { setTopBar, resetTopBar } = useOutletContext<TopBarOutletContext>();
  const [period, setPeriod] = useState<ProfitHistoryPeriod>("day");

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
        data={PROFIT_HISTORY_SUMMARY_MOCK[period]}
      />

      <div aria-hidden="true" className="h-8 bg-neutral-50" />
    </main>
  );
}
