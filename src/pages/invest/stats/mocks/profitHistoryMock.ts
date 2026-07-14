import biotechIcon from "@/assets/investment/investment-biotech.svg";
import coinIcon from "@/assets/investment/investment-coin.svg";
import energyIcon from "@/assets/investment/investment-energy.svg";
import semiconductorIcon from "@/assets/investment/investment-semiconductor.svg";
import technologyIcon from "@/assets/investment/investment-technology.svg";
import type {
  ProfitHistoryData,
  ProfitHistoryPeriod,
  ProfitHistorySector,
} from "@/pages/invest/stats/types";

const sectors: ProfitHistorySector[] = [
  {
    sectorCode: "BIO",
    name: "바이오",
    iconSrc: biotechIcon,
    profitAmount: 56000,
    profitRate: 8.0,
    investmentAmount: 700000,
  },
  {
    sectorCode: "SEMICONDUCTOR",
    name: "반도체",
    iconSrc: semiconductorIcon,
    profitAmount: 84000,
    profitRate: 7.0,
    investmentAmount: 1200000,
  },
  {
    sectorCode: "TECH",
    name: "테크",
    iconSrc: technologyIcon,
    profitAmount: 40000,
    profitRate: 5.0,
    investmentAmount: 800000,
  },
  {
    sectorCode: "ENERGY",
    name: "에너지",
    iconSrc: energyIcon,
    profitAmount: 20000,
    profitRate: 4.0,
    investmentAmount: 500000,
  },
  {
    sectorCode: "COIN",
    name: "코인",
    iconSrc: coinIcon,
    profitAmount: -15000,
    profitRate: -5.0,
    investmentAmount: 300000,
  },
];

const baseSummary = {
  profitAmount: 1035000,
  profitRate: 5.3,
  investmentAmount: 135700000,
};

export const profitHistoryMock: Record<ProfitHistoryPeriod, ProfitHistoryData> =
  {
    day: {
      period: "DAY",
      date: "2026-06-21",
      hasPrev: true,
      hasNext: false,
      summary: {
        title: "6월 21일 수익률",
        ...baseSummary,
      },
      sort: "RATE_DESC",
      sectors,
    },
    week: {
      period: "WEEK",
      date: "2026-W25",
      hasPrev: true,
      hasNext: false,
      summary: {
        title: "6월 3주차 수익률",
        ...baseSummary,
      },
      sort: "RATE_DESC",
      sectors,
    },
    month: {
      period: "MONTH",
      date: "2026-06",
      hasPrev: true,
      hasNext: false,
      summary: {
        title: "6월 수익률",
        ...baseSummary,
      },
      sort: "RATE_DESC",
      sectors,
    },
    year: {
      period: "YEAR",
      date: "2026",
      hasPrev: true,
      hasNext: false,
      summary: {
        title: "26년도 수익률",
        ...baseSummary,
      },
      sort: "RATE_DESC",
      sectors,
    },
    all: {
      period: "ALL",
      hasPrev: false,
      hasNext: false,
      summary: {
        title: "총 누적 수익률",
        ...baseSummary,
      },
      sort: "RATE_DESC",
      sectors,
    },
  };
