import muffinButter from "@/assets/avatars/muffin-butter.png";
import muffinCream from "@/assets/avatars/muffin-cream.png";
import muffinSprinkle from "@/assets/avatars/muffin-sprinkle.png";
import type {
  MyRankingData,
  WeeklyRankingData,
} from "@/pages/invest/ranking/types";

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
    },
    {
      rank: 2,
      nickname: "수익마스터왕",
      weeklyProfit: 98000,
      weeklyProfitRate: 9.8,
      characterImageUrl: muffinButter,
    },
    {
      rank: 3,
      nickname: "반도체러버",
      weeklyProfit: 87000,
      weeklyProfitRate: 8.7,
      characterImageUrl: muffinCream,
    },
    {
      rank: 4,
      nickname: "안전투자자",
      weeklyProfit: 48000,
      weeklyProfitRate: 4.8,
    },
    {
      rank: 5,
      nickname: "투자 초보",
      weeklyProfit: 45000,
      weeklyProfitRate: 4.5,
    },
    {
      rank: 6,
      nickname: "코인믿음",
      weeklyProfit: 38000,
      weeklyProfitRate: 3.8,
    },
    {
      rank: 7,
      nickname: "장기투자",
      weeklyProfit: 35000,
      weeklyProfitRate: 3.5,
    },
    {
      rank: 8,
      nickname: "분산왕",
      weeklyProfit: 28000,
      weeklyProfitRate: 2.8,
    },
    {
      rank: 9,
      nickname: "안전투자자",
      weeklyProfit: 27000,
      weeklyProfitRate: 2.7,
    },
    {
      rank: 10,
      nickname: "초보투자자",
      weeklyProfit: 24000,
      weeklyProfitRate: 2.4,
    },
  ],
};
