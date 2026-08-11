import InvestAssetSummary from "@/pages/invest/components/InvestAssetSummary";
import InvestTabBar from "@/pages/invest/components/InvestTabBar";
import { useInvestmentAssetQuery } from "@/pages/invest/investmentAssetQueries";

function getSignedValueByDirection(value: number, direction: string) {
  if (direction === "DOWN") return -Math.abs(value);
  if (direction === "UP") return Math.abs(value);

  return value;
}

export default function InvestHeader() {
  const investmentAssetQuery = useInvestmentAssetQuery();
  const asset = investmentAssetQuery.data;

  const profitAmount =
    asset === undefined
      ? undefined
      : getSignedValueByDirection(
          asset.dailyChangeAmount,
          asset.changeDirection,
        );

  const profitRate =
    asset === undefined
      ? undefined
      : getSignedValueByDirection(asset.dailyChangeRate, asset.changeDirection);

  return (
    <>
      <header>
        <InvestAssetSummary
          totalAsset={asset?.totalAsset}
          profitAmount={profitAmount}
          profitRate={profitRate}
          isLoading={
            investmentAssetQuery.isLoading || investmentAssetQuery.isError
          }
        />
      </header>

      <div className="bg-neutral-0 sticky -top-px z-20 w-full shadow-[0_4px_2px_rgba(0,0,0,0.05)]">
        <InvestTabBar />
      </div>
    </>
  );
}
