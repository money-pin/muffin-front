import biotechIcon from "@/assets/investment/investment-biotech.svg";
import bondsIcon from "@/assets/investment/investment-bonds.svg";
import coinIcon from "@/assets/investment/investment-coin.svg";
import defenseIcon from "@/assets/investment/investment-defense.svg";
import dollarIcon from "@/assets/investment/investment-dollar.svg";
import goldIcon from "@/assets/investment/investment-gold.svg";
import semiconductorIcon from "@/assets/investment/investment-semiconductor.svg";
import technologyIcon from "@/assets/investment/investment-technology.svg";
import type {
  CumulativeProfit,
  InvestmentProfile,
  ProfitTrendPoint,
  RecentPerformanceSummary,
  SectorPerformanceDetail,
  TopSector,
} from "@/pages/invest/stats/types";

export const statsMock: {
  recentPerformance: RecentPerformanceSummary;
  sectorDetails: SectorPerformanceDetail[];
  cumulativeProfit: CumulativeProfit;
  trend: ProfitTrendPoint[];
  topSectors: TopSector[];
  profile: InvestmentProfile;
} = {
  recentPerformance: {
    date: {
      month: 5,
      day: 7,
    },
    profitAmount: 45000,
    profitRate: 4.8,
    investmentAmount: 1000000,
  },
  sectorDetails: [
    {
      id: "semiconductor",
      name: "반도체",
      iconSrc: semiconductorIcon,
      profitAmount: 48000,
      profitRate: 4.8,
      investmentAmount: 300000,
    },
    {
      id: "gold",
      name: "금",
      iconSrc: goldIcon,
      profitAmount: 4000,
      profitRate: 2.0,
      investmentAmount: 200000,
    },
    {
      id: "dollar",
      name: "달러",
      iconSrc: dollarIcon,
      profitAmount: 12000,
      profitRate: 6.0,
      investmentAmount: 200000,
    },
    {
      id: "bond",
      name: "채권",
      iconSrc: bondsIcon,
      profitAmount: 15000,
      profitRate: 5.0,
      investmentAmount: 300000,
    },
    {
      id: "bio",
      name: "바이오",
      iconSrc: biotechIcon,
      profitAmount: 16000,
      profitRate: 8.0,
      investmentAmount: 200000,
    },
    {
      id: "defense",
      name: "방산",
      iconSrc: defenseIcon,
      profitAmount: -16000,
      profitRate: -8.0,
      investmentAmount: 200000,
    },
    {
      id: "it",
      name: "IT",
      iconSrc: technologyIcon,
      profitAmount: 85000,
      profitRate: 8.7,
      investmentAmount: 300000,
    },
    {
      id: "coin",
      name: "코인",
      iconSrc: coinIcon,
      profitAmount: 65000,
      profitRate: 6.8,
      investmentAmount: 300000,
    },
  ],
  cumulativeProfit: {
    amount: 465000,
    rate: 5.7,
  },
  trend: [
    { label: "5/1", value: 0 },
    { label: "5/2", value: 1.5 },
    { label: "5/3", value: 1.0 },
    { label: "5/4", value: 2.6 },
    { label: "5/5", value: 3.3 },
    { label: "5/6", value: 2.9 },
    { label: "5/7", value: 4.5 },
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
      "기초 자산 40%, 기술주 35%, 글로벌 경제 25%",
      "리스크 관리를 중시하는 신중한 접근",
      "중장기적 관점의 포트폴리오 구성",
    ],
  },
};
