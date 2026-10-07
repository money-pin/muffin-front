import { useCallback, useState } from "react";

import {
  getMaxInvestableQuantity,
  getRemainingInvestmentBudget,
  getTotalInvestAmount,
  isSameQuantityMap,
  updateInvestmentQuantity,
} from "@/pages/invest/trade/utils/investmentSelection";
import type {
  InvestAssetId,
  InvestmentQuantityMap,
} from "@/pages/invest/trade/types/invest";

interface UseInvestmentSelectionParams {
  unitAmount: number;
  totalBudget: number;
}

interface InvestmentSelectionState {
  selectedAssetId: InvestAssetId | null;
  quantities: InvestmentQuantityMap;
  initialQuantities: InvestmentQuantityMap;
}

export function useInvestmentSelection({
  unitAmount,
  totalBudget,
}: UseInvestmentSelectionParams) {
  // 서버 응답은 보관하지 않는다. 수정 시작 시 받은 수량을 비교 기준으로 유지한다.
  const [selection, setSelection] = useState<InvestmentSelectionState>({
    selectedAssetId: null,
    quantities: {},
    initialQuantities: {},
  });
  const { quantities, selectedAssetId, initialQuantities } = selection;
  const totalAmount = getTotalInvestAmount(quantities, unitAmount);
  const remainingBudget = getRemainingInvestmentBudget(
    totalBudget,
    totalAmount,
  );
  const selectedQuantity = selectedAssetId
    ? (quantities[selectedAssetId] ?? 0)
    : 0;
  const selectedMaxQuantity = selectedAssetId
    ? getMaxInvestableQuantity(
        quantities,
        selectedAssetId,
        unitAmount,
        totalBudget,
      )
    : 0;

  const replaceQuantities = useCallback(
    (
      nextQuantities: InvestmentQuantityMap,
      nextSelectedAssetId: InvestAssetId | null = null,
    ) => {
      setSelection({
        quantities: { ...nextQuantities },
        initialQuantities: { ...nextQuantities },
        selectedAssetId: nextSelectedAssetId,
      });
    },
    [],
  );

  // 카드 선택과 +/- 모두 최신 수량을 기준으로 같은 예산 제한을 적용한다.
  const changeQuantity = useCallback(
    (assetId: InvestAssetId | null, delta: number) => {
      setSelection((current) => {
        const targetId = assetId ?? current.selectedAssetId;
        if (!targetId) return current;

        const nextQuantities = updateInvestmentQuantity(
          current.quantities,
          targetId,
          (current.quantities[targetId] ?? 0) + delta,
          unitAmount,
          totalBudget,
        );

        return {
          ...current,
          quantities: nextQuantities,
          selectedAssetId:
            delta < 0 && !nextQuantities[targetId] ? null : targetId,
        };
      });
    },
    [totalBudget, unitAmount],
  );

  const resetSelection = useCallback(() => {
    setSelection((current) => ({
      ...current,
      quantities: {},
      selectedAssetId: null,
    }));
  }, []);

  return {
    quantities,
    selectedAssetId,
    selectedQuantity,
    selectedTotalAmount: selectedQuantity * unitAmount,
    totalAmount,
    remainingBudget,
    hasInvestment: totalAmount > 0,
    isChanged: !isSameQuantityMap(quantities, initialQuantities),
    isWithinBudget:
      Number.isFinite(unitAmount) &&
      unitAmount > 0 &&
      Number.isFinite(totalBudget) &&
      totalAmount <= totalBudget,
    canDecrease: selectedQuantity > 0,
    canIncrease:
      selectedAssetId !== null && selectedQuantity < selectedMaxQuantity,
    incrementAsset: (assetId: InvestAssetId) => changeQuantity(assetId, 1),
    incrementSelectedAsset: () => changeQuantity(null, 1),
    decrementSelectedAsset: () => changeQuantity(null, -1),
    replaceQuantities,
    resetSelection,
  };
}
