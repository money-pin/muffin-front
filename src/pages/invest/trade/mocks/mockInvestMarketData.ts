import type { InvestAssetId } from "@/types/invest";

export const MOCK_INVEST_MARKET_DATA: {
  totalBudget: number;
  remainingBudget: number;
  assetPrices: Record<InvestAssetId, number>;
} = {
  totalBudget: 1000000,
  remainingBudget: 1000000,
  assetPrices: {
    deposit: 100000,
    gold: 100000,
    dollar: 100000,
    bonds: 100000,
    coin: 100000,
    biotech: 100000,
    semiconductor: 100000,
    technology: 100000,
    energy: 100000,
    financials: 100000,
    automobile: 100000,
    defense: 100000,
  },
};
