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

  const toggleAssetSelection = useCallback(
    (assetId: InvestAssetId) => {
      setSelection((current) => {
        if (current.selectedAssetId === assetId) {
          const nextQuantities = { ...current.quantities };
          delete nextQuantities[assetId];

          return {
            ...current,
            quantities: nextQuantities,
            selectedAssetId: null,
          };
        }

        // 이미 보유한 다른 카드는 수량 변경 없이 포커스만 옮긴다.
        if ((current.quantities[assetId] ?? 0) > 0) {
          return { ...current, selectedAssetId: assetId };
        }

        const nextQuantities = updateInvestmentQuantity(
          current.quantities,
          assetId,
          1,
          unitAmount,
          totalBudget,
        );
        if (!nextQuantities[assetId]) return current;

        return {
          ...current,
          quantities: nextQuantities,
          selectedAssetId: assetId,
        };
      });
    },
    [totalBudget, unitAmount],
  );

  // 카드 신규 선택과 +/- 모두 최신 수량을 기준으로 같은 예산 제한을 적용한다.
  const changeQuantity = useCallback(
    (delta: number) => {
      setSelection((current) => {
        const targetId = current.selectedAssetId;
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
    toggleAssetSelection,
    incrementSelectedAsset: () => changeQuantity(1),
    decrementSelectedAsset: () => changeQuantity(-1),
    replaceQuantities,
    resetSelection,
  };
}
