import InvestAssetSummary from "@/pages/invest/components/InvestAssetSummary";
import InvestTabBar from "@/pages/invest/components/InvestTabBar";

export default function InvestHeader() {
  return (
    <>
      <header>
        <InvestAssetSummary
          totalAsset={1045000}
          profitAmount={45000}
          profitRate={4.5}
        />
      </header>

      <div className="bg-neutral-0 sticky top-0 z-20 w-full shadow-[0_4px_2px_rgba(0,0,0,0.05)]">
        <InvestTabBar />
      </div>
    </>
  );
}
