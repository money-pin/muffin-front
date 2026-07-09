import InvestAssetSummary from "@/pages/invest/components/InvestAssetSummary";
import InvestTabBar from "@/pages/invest/components/InvestTabBar";

export default function InvestHeader() {
  return (
    <header className="w-full bg-neutral-0">
      <InvestAssetSummary
        totalAsset={1045000}
        profitAmount={45000}
        profitRate={4.5}
      />
      <InvestTabBar />
    </header>
  );
}
