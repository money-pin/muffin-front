import type {
  ConfirmInvestmentRequest,
  InvestAssetId,
  InvestAssetMeta,
  InvestmentQuantityMap,
  InvestmentSummaryItem,
  TodayInvestmentResult,
} from "@/pages/invest/trade/types/invest";

function normalizeQuantity(quantity: number | undefined) {
  if (!Number.isFinite(quantity)) return 0;

  return Math.max(0, Math.floor(quantity ?? 0));
}

// 예산 누락은 0원과 구분한다. 알 수 없는 예산으로 재시도하지 않는다.
export function getInvestmentBudget(data: TodayInvestmentResult | null) {
  const remaining = data?.remainingAmount;
  const invested = data?.totalAmount ?? data?.previousInvestment?.totalAmount;
  if (
    typeof remaining !== "number" ||
    typeof invested !== "number" ||
    !Number.isFinite(remaining) ||
    !Number.isFinite(invested) ||
    remaining < 0 ||
    invested < 0
  )
    return null;
  const total = remaining + invested;
  return Number.isFinite(total) ? total : null;
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
  const currentQuantity = normalizeQuantity(quantities[assetId]);
  const requested = normalizeQuantity(requestedQuantity);
  // 예산이 줄어든 경우에도 감소는 요청한 만큼만 적용한다.
  const nextQuantity =
    requested <= currentQuantity
      ? requested
      : Math.max(currentQuantity, Math.min(requested, maxQuantity));

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

// 서버 배열 순서와 무관하게 오늘의 확정 수량이 실패한 요청과 같은지 확인한다.
export function isSameInvestmentRequest(
  request: ConfirmInvestmentRequest,
  sectors: readonly { sectorCode: string; quantity: number }[],
) {
  const actual = sectors.filter((item) => item.quantity > 0);
  return (
    actual.length === request.sectors.length &&
    request.sectors.every((expected) =>
      actual.some(
        (item) =>
          item.sectorCode === expected.sectorCode &&
          item.quantity === expected.quantity,
      ),
    )
  );
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
