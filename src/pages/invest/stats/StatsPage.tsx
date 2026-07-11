import InvestmentStyleCard from "./components/InvestmentStyleCard";
import ProfitRateTrendCard from "./components/ProfitRateTrendCard";
import RecentPerformanceCard from "./components/RecentPerformanceCard";
import TopProfitSectorsCard from "./components/TopProfitSectorsCard";
import TotalProfitCard from "./components/TotalProfitCard";
import type {
  CumulativeProfit,
  InvestmentProfile,
  InvestmentResultDate,
  ProfitTrendPoint,
  TopSector,
} from "./types";

const statsMock: {
  resultDate: InvestmentResultDate;
  cumulativeProfit: CumulativeProfit;
  trend: ProfitTrendPoint[];
  topSectors: TopSector[];
  profile: InvestmentProfile;
} = {
  resultDate: {
    month: 5,
    day: 7,
  },
  cumulativeProfit: {
    amount: 465000,
    rate: 5.7,
  },
  trend: [
    { label: "5/1", value: 0 },
    { label: "5/2", value: 15000 },
    { label: "5/3", value: 10000 },
    { label: "5/4", value: 26000 },
    { label: "5/5", value: 33000 },
    { label: "5/6", value: 29000 },
    { label: "5/7", value: 45000 },
  ],
  topSectors: [
    { rank: 1, name: "반도체", profitAmount: 45000, profitRate: 12.5 },
    { rank: 2, name: "IT", profitAmount: 85000, profitRate: 8.7 },
    { rank: 3, name: "코인", profitAmount: 65000, profitRate: 6.8 },
  ],
  profile: {
    type: "균형형 투자자",
    description: "안정성과 수익성을 적절히 조합하는 투자 스타일",
    details: [
      "기초 자산 40%, 기술주 35%, 실물 경제 25%",
      "리스크 관리를 중시하는 신중한 접근",
      "중장기적 관점의 포트폴리오 구성",
    ],
  },
};

export default function StatsPage() {
  return (
    <main className="flex flex-col gap-3 bg-neutral-50 px-5 pb-24 pt-6">
      <RecentPerformanceCard date={statsMock.resultDate} />
      <TotalProfitCard data={statsMock.cumulativeProfit} />
      <ProfitRateTrendCard data={statsMock.trend} />
      <TopProfitSectorsCard sectors={statsMock.topSectors} />
      <InvestmentStyleCard profile={statsMock.profile} />
    </main>
  );
}
