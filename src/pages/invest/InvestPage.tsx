import InvestBudgetCard from "./components/invest/InvestBudgetCard";
import InvestAssetCard from "./components/invest/InvestAssetCard";

import { INVEST_ASSET_SECTIONS } from "./constants/investAsset";
import { MOCK_INVEST_MARKET_DATA } from "./mocks/mockInvestMarketData";

function InvestPage() {
  return (
    <div className="flex flex-col gap-5">
      <InvestBudgetCard
        totalBudget={MOCK_INVEST_MARKET_DATA.totalBudget}
        remainingBudget={MOCK_INVEST_MARKET_DATA.remainingBudget}
      />

      {INVEST_ASSET_SECTIONS.map((section) => (
        <div key={section.id} className="flex flex-col gap-2">
          <h2 className="text-[length:var(--text-body-16-bd-tighter)] leading-[var(--text-body-16-bd-tighter--line-height)] font-[var(--text-body-16-bd-tighter--font-weight)] text-[var(--color-neutral-900)]">
            {section.title}
          </h2>

          <div className="flex justify-between">
            {section.items.map((asset) => (
              <InvestAssetCard
                key={asset.id}
                name={asset.name}
                icon={asset.icon}
                activeIcon={asset.activeIcon}
                status="default"
                quantity={0}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default InvestPage;
