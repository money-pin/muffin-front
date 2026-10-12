import type {
  ConfirmInvestmentRequest,
  InvestAssetId,
  InvestAssetMeta,
  InvestmentQuantityMap,
  InvestmentSummaryItem,
} from "@/pages/invest/trade/types/invest";

function normalizeQuantity(quantity: number | undefined) {
  if (!Number.isFinite(quantity)) return 0;

  return Math.max(0, Math.floor(quantity ?? 0));
}

export function getTotalInvestAmount(
  quantities: InvestmentQuantityMap,
  unitAmount: number,
) {
  if (!Number.isFinite(unitAmount) || unitAmount <= 0) return 0;

  return Object.values(quantities).reduce((total, quantity) => {
    return total + normalizeQuantity(quantity) * unitAmount;
  }, 0);
}

export function getRemainingInvestmentBudget(
  totalBudget: number,
  totalInvestAmount: number,
) {
  return Math.max(0, totalBudget - totalInvestAmount);
}

export function getMaxInvestableQuantity(
  quantities: InvestmentQuantityMap,
  assetId: InvestAssetId,
  unitAmount: number,
  totalBudget: number,
) {
  if (
    !Number.isFinite(unitAmount) ||
    !Number.isFinite(totalBudget) ||
    unitAmount <= 0 ||
    totalBudget <= 0
  )
    return 0;

  const currentQuantity = normalizeQuantity(quantities[assetId]);
  const currentTotalAmount = getTotalInvestAmount(quantities, unitAmount);
  const amountWithoutAsset = Math.max(
    0,
    currentTotalAmount - currentQuantity * unitAmount,
  );

  return Math.max(
    0,
    Math.floor((totalBudget - amountWithoutAsset) / unitAmount),
  );
}

export function updateInvestmentQuantity(
  quantities: InvestmentQuantityMap,
  assetId: InvestAssetId,
  requestedQuantity: number,
  unitAmount: number,
  totalBudget: number,
) {
  const maxQuantity = getMaxInvestableQuantity(
    quantities,
    assetId,
    unitAmount,
    totalBudget,
  );
  const nextQuantity = Math.min(
    normalizeQuantity(requestedQuantity),
    maxQuantity,
  );
  const currentQuantity = normalizeQuantity(quantities[assetId]);

  if (nextQuantity === currentQuantity) return quantities;

  const nextQuantities = { ...quantities };

  if (nextQuantity === 0) {
    delete nextQuantities[assetId];
  } else {
    nextQuantities[assetId] = nextQuantity;
  }

  return nextQuantities;
}

export function isSameQuantityMap(
  current: InvestmentQuantityMap,
  confirmed: InvestmentQuantityMap,
) {
  const assetIds = new Set([
    ...Object.keys(current),
    ...Object.keys(confirmed),
  ]);

  return Array.from(assetIds).every((assetId) => {
    const typedAssetId = assetId as InvestAssetId;

    return (
      normalizeQuantity(current[typedAssetId]) ===
      normalizeQuantity(confirmed[typedAssetId])
    );
  });
}

export function createInvestmentRequest(
  quantities: InvestmentQuantityMap,
  assetById: ReadonlyMap<InvestAssetId, InvestAssetMeta>,
): ConfirmInvestmentRequest {
  const sectors = Object.entries(quantities).flatMap(([assetId, quantity]) => {
    const typedAssetId = assetId as InvestAssetId;
    const normalizedQuantity = normalizeQuantity(quantity);
    const asset = assetById.get(typedAssetId);

    if (!asset || normalizedQuantity === 0) return [];

    return {
      sectorCode: asset.sectorCode,
      quantity: normalizedQuantity,
    };
  });

  return { sectors };
}

export function createInvestmentSummaryItems(
  quantities: InvestmentQuantityMap,
  assetById: ReadonlyMap<InvestAssetId, InvestAssetMeta>,
  unitAmount: number,
): InvestmentSummaryItem[] {
  const totalAmount = getTotalInvestAmount(quantities, unitAmount);

  return Object.entries(quantities).flatMap(([assetId, quantity]) => {
    const typedAssetId = assetId as InvestAssetId;
    const normalizedQuantity = normalizeQuantity(quantity);
    const asset = assetById.get(typedAssetId);

    if (!asset || normalizedQuantity === 0) return [];

    const amount = unitAmount * normalizedQuantity;

    return {
      assetId: typedAssetId,
      name: asset.name,
      icon: asset.activeIcon,
      amount,
      percentage:
        totalAmount > 0 ? Math.round((amount / totalAmount) * 100) : 0,
    };
  });
}
