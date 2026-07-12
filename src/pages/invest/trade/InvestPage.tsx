import { useMemo, useState } from "react";
import InvestCompleteModal from "@/pages/invest/trade/components/InvestCompleteModal";
import InvestAssetCard from "@/pages/invest/trade/components/InvestAssetCard";
import InvestAssetCountBar from "@/pages/invest/trade/components/InvestAssetCountBar";
import InvestBottomAction from "@/pages/invest/trade/components/InvestBottomAction";
import InvestBudgetCard from "@/pages/invest/trade/components/InvestBudgetCard";
import InvestConfirmBottomSheet from "@/pages/invest/trade/components/InvestConfirmBottomSheet";

import { INVEST_ASSET_SECTIONS } from "@/pages/invest/trade/constants/investAsset";
import { MOCK_INVEST_MARKET_DATA } from "@/pages/invest/trade/mocks/mockInvestMarketData";

import type { InvestAssetId } from "@/pages/invest/trade/types/invest";

type AssetQuantityMap = Partial<Record<InvestAssetId, number>>;

function InvestPage() {
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [selectedAssetId, setSelectedAssetId] = useState<InvestAssetId | null>(
    null,
  );

  const [assetQuantities, setAssetQuantities] = useState<AssetQuantityMap>({});
  const [isConfirmSheetOpen, setIsConfirmSheetOpen] = useState(false);

  const allAssets = useMemo(() => {
    return INVEST_ASSET_SECTIONS.flatMap((section) => section.items);
  }, []);

  const selectedAsset = useMemo(() => {
    return allAssets.find((asset) => asset.id === selectedAssetId);
  }, [allAssets, selectedAssetId]);

  const selectedQuantity = selectedAssetId
    ? (assetQuantities[selectedAssetId] ?? 0)
    : 0;

  const selectedAssetPrice = selectedAssetId
    ? MOCK_INVEST_MARKET_DATA.assetPrices[selectedAssetId]
    : 0;

  const selectedAssetTotalAmount = selectedAssetPrice * selectedQuantity;

  const totalInvestAmount = Object.entries(assetQuantities).reduce(
    (sum, [assetId, quantity]) => {
      const typedAssetId = assetId as InvestAssetId;
      const price = MOCK_INVEST_MARKET_DATA.assetPrices[typedAssetId] ?? 0;

      return sum + price * (quantity ?? 0);
    },
    0,
  );

  const remainingBudget = Math.max(
    0,
    MOCK_INVEST_MARKET_DATA.totalBudget - totalInvestAmount,
  );

  const confirmItems = Object.entries(assetQuantities)
    .filter(([, quantity]) => (quantity ?? 0) > 0)
    .map(([assetId, quantity]) => {
      const typedAssetId = assetId as InvestAssetId;
      const asset = allAssets.find((item) => item.id === typedAssetId);
      const unitPrice = MOCK_INVEST_MARKET_DATA.assetPrices[typedAssetId];
      const amount = unitPrice * (quantity ?? 0);
      const percentage =
        totalInvestAmount > 0
          ? Math.round((amount / totalInvestAmount) * 100)
          : 0;

      return {
        assetId: typedAssetId,
        name: asset?.name ?? "",
        icon: asset?.activeIcon ?? "",
        amount,
        percentage,
      };
    });

  const canDecrease = selectedQuantity > 0;

  const canIncrease =
    selectedAssetPrice > 0 && remainingBudget >= selectedAssetPrice;

  const hasAnyInvestment = totalInvestAmount > 0;

  const handleAssetClick = (assetId: InvestAssetId) => {
    setSelectedAssetId(assetId);

    setAssetQuantities((prev) => {
      const currentQuantity = prev[assetId] ?? 0;

      if (currentQuantity > 0) {
        return prev;
      }

      const assetPrice = MOCK_INVEST_MARKET_DATA.assetPrices[assetId];

      if (
        totalInvestAmount + assetPrice >
        MOCK_INVEST_MARKET_DATA.totalBudget
      ) {
        return prev;
      }

      return {
        ...prev,
        [assetId]: 1,
      };
    });
  };

  const handleDecrease = () => {
    if (!selectedAssetId) return;

    setAssetQuantities((prev) => {
      const currentQuantity = prev[selectedAssetId] ?? 0;
      const nextQuantity = Math.max(0, currentQuantity - 1);

      if (nextQuantity === 0) {
        const next = { ...prev };
        delete next[selectedAssetId];

        setSelectedAssetId(null);

        return next;
      }

      return {
        ...prev,
        [selectedAssetId]: nextQuantity,
      };
    });
  };

  const handleIncrease = () => {
    if (!selectedAssetId || !canIncrease) return;

    setAssetQuantities((prev) => {
      const currentQuantity = prev[selectedAssetId] ?? 0;

      return {
        ...prev,
        [selectedAssetId]: currentQuantity + 1,
      };
    });
  };

  const handleReset = () => {
    setSelectedAssetId(null);
    setAssetQuantities({});
  };

  const handlePurchase = () => {
    if (!hasAnyInvestment) return;

    setIsConfirmSheetOpen(true);
  };

  const handleConfirmPurchase = () => {
    const investmentPayload = Object.entries(assetQuantities)
      .filter(([, quantity]) => (quantity ?? 0) > 0)
      .map(([assetId, quantity]) => {
        const typedAssetId = assetId as InvestAssetId;
        const unitPrice = MOCK_INVEST_MARKET_DATA.assetPrices[typedAssetId];

        return {
          assetId: typedAssetId,
          quantity,
          unitPrice,
          totalAmount: unitPrice * (quantity ?? 0),
        };
      });

    console.log("백엔드로 보낼 투자 내용:", {
      totalAmount: totalInvestAmount,
      remainingBudget,
      investments: investmentPayload,
    });

    setIsConfirmSheetOpen(false);
    setIsCompleteModalOpen(true);
  };

  return (
    <>
      <div className="flex flex-1 flex-col gap-5 bg-[var(--color-neutral-50)] px-5 pt-5 pb-[240px]">
        <InvestBudgetCard
          totalBudget={MOCK_INVEST_MARKET_DATA.totalBudget}
          remainingBudget={remainingBudget}
        />

        {INVEST_ASSET_SECTIONS.map((section) => (
          <div key={section.id} className="flex flex-col gap-2">
            <h2 className="text-[length:var(--text-body-16-bd-tighter)] leading-[var(--text-body-16-bd-tighter--line-height)] font-[var(--text-body-16-bd-tighter--font-weight)] text-[var(--color-neutral-900)]">
              {section.title}
            </h2>

            <div className="flex justify-between">
              {section.items.map((asset) => {
                const quantity = assetQuantities[asset.id] ?? 0;
                const isSelected = selectedAssetId === asset.id && quantity > 0;
                const isPurchased =
                  selectedAssetId !== asset.id && quantity > 0;

                return (
                  <InvestAssetCard
                    key={asset.id}
                    name={asset.name}
                    icon={asset.icon}
                    activeIcon={asset.activeIcon}
                    status={
                      isSelected
                        ? "selected"
                        : isPurchased
                          ? "purchased"
                          : "default"
                    }
                    quantity={quantity}
                    onClick={() => handleAssetClick(asset.id)}
                  />
                );
              })}
            </div>
          </div>
        ))}

        {selectedAsset && selectedQuantity > 0 && (
          <InvestAssetCountBar
            name={selectedAsset.name}
            totalAmount={selectedAssetTotalAmount}
            quantity={selectedQuantity}
            canDecrease={canDecrease}
            canIncrease={canIncrease}
            onDecrease={handleDecrease}
            onIncrease={handleIncrease}
          />
        )}

        <InvestBottomAction
          selectedTotalAmount={totalInvestAmount}
          onReset={handleReset}
          onPurchase={handlePurchase}
        />
      </div>

      <InvestConfirmBottomSheet
        isOpen={isConfirmSheetOpen}
        items={confirmItems}
        totalAmount={totalInvestAmount}
        onClose={() => setIsConfirmSheetOpen(false)}
        onConfirm={handleConfirmPurchase}
      />

      <InvestCompleteModal
        isOpen={isCompleteModalOpen}
        onClose={() => setIsCompleteModalOpen(false)}
      />
    </>
  );
}

export default InvestPage;
