import InvestAssetSummary from "@/pages/invest/components/InvestAssetSummary";
import InvestTabBar from "@/pages/invest/components/InvestTabBar";

export default function InvestHeader() {
  return (
    <header className="sticky top-0 z-20 w-full bg-neutral-0 shadow-[0_4px_2px_rgba(0,0,0,0.05)]">
      <InvestAssetSummary
        totalAsset={1045000}
        profitAmount={45000}
        profitRate={4.5}
      />
      <InvestTabBar />
    </header>
  );
}
