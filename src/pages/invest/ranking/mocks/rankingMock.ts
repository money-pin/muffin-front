import muffinButter from "@/assets/avatars/muffin-butter.png";
import muffinCream from "@/assets/avatars/muffin-cream.png";
import muffinSprinkle from "@/assets/avatars/muffin-sprinkle.png";
import automobileIcon from "@/assets/investment/investment-automobile.svg";
import biotechIcon from "@/assets/investment/investment-biotech.svg";
import bondsIcon from "@/assets/investment/investment-bonds.svg";
import coinIcon from "@/assets/investment/investment-coin.svg";
import defenseIcon from "@/assets/investment/investment-defense.svg";
import dollarIcon from "@/assets/investment/investment-dollar.svg";
import energyIcon from "@/assets/investment/investment-energy.svg";
import financialsIcon from "@/assets/investment/investment-financials.svg";
import goldIcon from "@/assets/investment/investment-gold.svg";
import semiconductorIcon from "@/assets/investment/investment-semiconductor.svg";
import technologyIcon from "@/assets/investment/investment-technology.svg";
import type {
  MyRankingData,
  WeeklyRankingItem,
  WeeklyRankingData,
} from "@/pages/invest/ranking/types";

const rankingUserSectors: WeeklyRankingItem["sectors"] = [
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
    id: "bonds",
    name: "채권",
    iconSrc: bondsIcon,
    profitAmount: 15000,
    profitRate: 5.0,
    investmentAmount: 300000,
  },
  {
    id: "biotech",
    name: "바이오",
    iconSrc: biotechIcon,
    profitAmount: 16000,
    profitRate: 8.0,
    investmentAmount: 200000,
  },
  {
    id: "technology",
    name: "테크",
    iconSrc: technologyIcon,
    profitAmount: 11000,
    profitRate: 3.8,
    investmentAmount: 290000,
  },
  {
    id: "energy",
    name: "에너지",
    iconSrc: energyIcon,
    profitAmount: 9000,
    profitRate: 3.0,
    investmentAmount: 300000,
  },
  {
    id: "financials",
    name: "금융",
    iconSrc: financialsIcon,
    profitAmount: 7000,
    profitRate: 2.8,
    investmentAmount: 250000,
  },
  {
    id: "automobile",
    name: "자동차",
    iconSrc: automobileIcon,
    profitAmount: 6000,
    profitRate: 2.4,
    investmentAmount: 250000,
  },
  {
    id: "coin",
    name: "코인",
    iconSrc: coinIcon,
    profitAmount: 5000,
    profitRate: 2.5,
    investmentAmount: 200000,
  },
  {
    id: "defense",
    name: "방산",
    iconSrc: defenseIcon,
    profitAmount: 3000,
    profitRate: 1.5,
    investmentAmount: 200000,
  },
];

export const myRankingMock: MyRankingData = {
  weekLabel: "5월 2주차 기준",
  myRank: {
    rank: 24568979,
    nickname: "예은",
    percentile: 2,
    participated: true,
  },
};

export const notParticipatedMyRankingMock: MyRankingData = {
  weekLabel: "5월 2주차 기준",
  myRank: {
    participated: false,
  },
};

export const weeklyRankingMock: WeeklyRankingData = {
  weekLabel: "5월 2주차 기준",
  top10: [
    {
      rank: 1,
      nickname: "투자왕김씨",
      weeklyProfit: 125000,
      weeklyProfitRate: 12.5,
      characterImageUrl: muffinSprinkle,
      sectors: rankingUserSectors,
    },
    {
      rank: 2,
      nickname: "수익마스터왕",
      weeklyProfit: 98000,
      weeklyProfitRate: 9.8,
      characterImageUrl: muffinButter,
      sectors: rankingUserSectors.slice(0, 4),
    },
    {
      rank: 3,
      nickname: "반도체러버",
      weeklyProfit: 87000,
      weeklyProfitRate: 8.7,
      characterImageUrl: muffinCream,
      sectors: rankingUserSectors.slice(0, 3),
    },
    {
      rank: 4,
      nickname: "안전투자자",
      weeklyProfit: 48000,
      weeklyProfitRate: 4.8,
      sectors: rankingUserSectors,
    },
    {
      rank: 5,
      nickname: "투자 초보",
      weeklyProfit: 45000,
      weeklyProfitRate: 4.5,
      sectors: rankingUserSectors.slice(0, 2),
    },
    {
      rank: 6,
      nickname: "코인믿음",
      weeklyProfit: 38000,
      weeklyProfitRate: 3.8,
      sectors: rankingUserSectors.slice(0, 1),
    },
    {
      rank: 7,
      nickname: "장기투자",
      weeklyProfit: 35000,
      weeklyProfitRate: 3.5,
      sectors: rankingUserSectors.slice(1, 4),
    },
    {
      rank: 8,
      nickname: "분산왕",
      weeklyProfit: 28000,
      weeklyProfitRate: 2.8,
      sectors: rankingUserSectors.slice(2, 5),
    },
    {
      rank: 9,
      nickname: "안전투자자",
      weeklyProfit: 27000,
      weeklyProfitRate: 2.7,
      sectors: rankingUserSectors.slice(0, 2),
    },
    {
      rank: 10,
      nickname: "초보투자자",
      weeklyProfit: 24000,
      weeklyProfitRate: 2.4,
      sectors: rankingUserSectors.slice(4),
    },
  ],
};
