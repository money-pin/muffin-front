import { useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import InvestAssetCard from "@/pages/invest/trade/components/InvestAssetCard";
import InvestAssetCountBar from "@/pages/invest/trade/components/InvestAssetCountBar";
import InvestBottomAction from "@/pages/invest/trade/components/InvestBottomAction";
import InvestBudgetCard from "@/pages/invest/trade/components/InvestBudgetCard";
import InvestCompleteModal from "@/pages/invest/trade/components/InvestCompleteModal";
import InvestConfirmBottomSheet from "@/pages/invest/trade/components/InvestConfirmBottomSheet";
import InvestTodayStatusPage from "@/pages/invest/trade/components/InvestTodayStatusPage";
import InvestWeekendClosedPage from "@/pages/invest/trade/components/InvestWeekendClosedPage";

import { INVEST_ASSET_SECTIONS } from "@/pages/invest/trade/constants/investAsset";
import { MOCK_INVEST_MARKET_DATA } from "@/pages/invest/trade/mocks/mockInvestMarketData";
import {
  investmentQueryKeys,
  useConfirmInvestmentMutation,
  useInvestmentSectorsQuery,
  useTodayInvestmentQuery,
  useUpdateInvestmentMutation,
} from "@/pages/invest/trade/investQueries";

import type {
  ConfirmInvestmentRequest,
  InvestAssetId,
} from "@/pages/invest/trade/types/invest";

// 자산 구매 현황 저장
type AssetQuantityMap = Partial<Record<InvestAssetId, number>>;

// 투자 페이지 모드
type InvestViewMode = "trade" | "summary" | "edit";

// 개발 중 주말에도 투자 화면을 확인해야 하면 true로 변경
// PR 올리기 전에는 false로 돌려두는 것을 권장
const FORCE_TRADE_VIEW_FOR_DEV = false;

function getKstDate() {
  return new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" }),
  );
}

function getIsKstWeekend() {
  const kstNow = getKstDate();
  const day = kstNow.getDay();

  return day === 0 || day === 6;
}

// 총 투자 금액 계산
function getTotalInvestAmount(
  assetQuantities: AssetQuantityMap,
  unitAmount: number,
) {
  return Object.values(assetQuantities).reduce((sum, quantity) => {
    return sum + unitAmount * (quantity ?? 0);
  }, 0);
}

// 수정 버튼용 수량 체크
function isSameQuantityMap(
  current: AssetQuantityMap,
  confirmed: AssetQuantityMap,
) {
  const assetIds = new Set([
    ...Object.keys(current),
    ...Object.keys(confirmed),
  ]);

  return Array.from(assetIds).every((assetId) => {
    const typedAssetId = assetId as InvestAssetId;

    return (current[typedAssetId] ?? 0) === (confirmed[typedAssetId] ?? 0);
  });
}

function getErrorMessage(error: unknown, fallbackMessage: string) {
  if (!error) return "";

  return error instanceof Error ? error.message : fallbackMessage;
}

function InvestPage() {
  const isWeekend = getIsKstWeekend();
  const queryClient = useQueryClient();

  const investmentSectorsQuery = useInvestmentSectorsQuery();
  const todayInvestmentQuery = useTodayInvestmentQuery();
  const confirmInvestmentMutation = useConfirmInvestmentMutation();
  const updateInvestmentMutation = useUpdateInvestmentMutation();

  const sectorData = investmentSectorsQuery.data ?? null;
  const todayInvestmentData = todayInvestmentQuery.data ?? null;

  const sectorErrorMessage = getErrorMessage(
    investmentSectorsQuery.error,
    "투자 섹터 정보를 불러오지 못했어요.",
  );

  const todayInvestmentErrorMessage = getErrorMessage(
    todayInvestmentQuery.error,
    "오늘 투자 현황을 불러오지 못했어요.",
  );

  const [viewMode, setViewMode] = useState<InvestViewMode>("trade");
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [selectedAssetId, setSelectedAssetId] = useState<InvestAssetId | null>(
    null,
  );

  const [assetQuantities, setAssetQuantities] = useState<AssetQuantityMap>({});
  const [confirmedQuantities, setConfirmedQuantities] =
    useState<AssetQuantityMap>({});
  const [isConfirmSheetOpen, setIsConfirmSheetOpen] = useState(false);
  const [confirmInvestmentErrorMessage, setConfirmInvestmentErrorMessage] =
    useState("");
  const [isSubmittingInvestment, setIsSubmittingInvestment] = useState(false);

  const allAssets = useMemo(() => {
    return INVEST_ASSET_SECTIONS.flatMap((section) => section.items);
  }, []);

  const assetBySectorCode = useMemo(() => {
    return new Map(allAssets.map((asset) => [asset.sectorCode, asset]));
  }, [allAssets]);

  const allSectors = useMemo(() => {
    return sectorData?.groups.flatMap((group) => group.sectors) ?? [];
  }, [sectorData]);

  const sectorByCode = useMemo(() => {
    return new Map(allSectors.map((sector) => [sector.sectorCode, sector]));
  }, [allSectors]);

  const unitAmount = sectorData?.unitAmount ?? 100000;

  useEffect(() => {
    if (!todayInvestmentData) return;

    const nextConfirmedQuantities = todayInvestmentData.sectors.reduce(
      (acc, item) => {
        const asset = assetBySectorCode.get(item.sectorCode);

        if (!asset || item.quantity <= 0) return acc;

        return {
          ...acc,
          [asset.id]: item.quantity,
        };
      },
      {} as AssetQuantityMap,
    );

    const hasServerInvestment =
      Object.keys(nextConfirmedQuantities).length > 0;

    setConfirmedQuantities(nextConfirmedQuantities);

    if (hasServerInvestment) {
      setAssetQuantities(nextConfirmedQuantities);
      setSelectedAssetId(null);
      setViewMode("summary");
      return;
    }

    if (todayInvestmentData.status === "AVAILABLE") {
      setViewMode("trade");
    }
  }, [assetBySectorCode, todayInvestmentData]);

  const selectedAsset = useMemo(() => {
    return allAssets.find((asset) => asset.id === selectedAssetId);
  }, [allAssets, selectedAssetId]);

  const selectedQuantity = selectedAssetId
    ? (assetQuantities[selectedAssetId] ?? 0)
    : 0;

  const selectedAssetPrice = selectedAssetId ? unitAmount : 0;

  const selectedAssetTotalAmount = selectedAssetPrice * selectedQuantity;

  const totalInvestAmount = getTotalInvestAmount(assetQuantities, unitAmount);

  const confirmedTotalInvestAmount = getTotalInvestAmount(
    confirmedQuantities,
    unitAmount,
  );

  const serverTotalBudget =
    todayInvestmentData &&
    todayInvestmentData.remainingAmount + todayInvestmentData.totalAmount > 0
      ? todayInvestmentData.remainingAmount + todayInvestmentData.totalAmount
      : MOCK_INVEST_MARKET_DATA.totalBudget;

  const remainingBudget = Math.max(0, serverTotalBudget - totalInvestAmount);

  const hasServerInvestment = Boolean(
    todayInvestmentData?.sectors.some((item) => item.quantity > 0),
  );

  const canEditTodayInvestment =
    todayInvestmentData?.status === "CONFIRMED_EDITABLE";

  const isTodayClosed =
    todayInvestmentData?.status === "CLOSED" ||
    todayInvestmentData?.status === "BLOCKED" ||
    todayInvestmentData?.status === "NO_INVEST" ||
    (hasServerInvestment && !canEditTodayInvestment);

  const shouldShowWeekendClosedPage =
    !FORCE_TRADE_VIEW_FOR_DEV &&
    (todayInvestmentData
      ? todayInvestmentData.status !== "AVAILABLE" && !hasServerInvestment
      : isWeekend);

  // 확정 바텀시트에 보여줄 구매/수정 목록
  const confirmItems = Object.entries(assetQuantities)
    .filter(([, quantity]) => (quantity ?? 0) > 0)
    .map(([assetId, quantity]) => {
      const typedAssetId = assetId as InvestAssetId;
      const asset = allAssets.find((item) => item.id === typedAssetId);
      const amount = unitAmount * (quantity ?? 0);
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

  const serverTodayStatusItems =
    todayInvestmentData?.sectors.flatMap((item) => {
      const asset = assetBySectorCode.get(item.sectorCode);

      if (!asset || item.quantity <= 0) return [];

      return {
        assetId: asset.id,
        name: item.sectorName,
        icon: asset.activeIcon,
        amount: item.amount,
        percentage: Math.round(item.ratio),
      };
    }) ?? [];

  const localTodayStatusItems = Object.entries(confirmedQuantities)
    .filter(([, quantity]) => (quantity ?? 0) > 0)
    .map(([assetId, quantity]) => {
      const typedAssetId = assetId as InvestAssetId;
      const asset = allAssets.find((item) => item.id === typedAssetId);
      const amount = unitAmount * (quantity ?? 0);
      const percentage =
        confirmedTotalInvestAmount > 0
          ? Math.round((amount / confirmedTotalInvestAmount) * 100)
          : 0;

      return {
        assetId: typedAssetId,
        name: asset?.name ?? "",
        icon: asset?.activeIcon ?? "",
        amount,
        percentage,
      };
    });

  const todayStatusItems =
    serverTodayStatusItems.length > 0
      ? serverTodayStatusItems
      : localTodayStatusItems;

  const buildInvestmentBody = (): ConfirmInvestmentRequest => {
    const sectors = Object.entries(assetQuantities)
      .filter(([, quantity]) => (quantity ?? 0) > 0)
      .flatMap(([assetId, quantity]) => {
        const typedAssetId = assetId as InvestAssetId;
        const asset = allAssets.find((item) => item.id === typedAssetId);

        if (!asset) return [];

        return {
          sectorCode: asset.sectorCode,
          quantity: quantity ?? 0,
        };
      });

    return { sectors };
  };

  const canDecrease = selectedQuantity > 0;

  const canIncrease =
    selectedAssetPrice > 0 && remainingBudget >= selectedAssetPrice;

  const hasAnyInvestment = totalInvestAmount > 0;

  const hasAssetCountBar = Boolean(selectedAsset && selectedQuantity > 0);

  const isEditMode = viewMode === "edit";

  const isEditChanged =
    isEditMode && !isSameQuantityMap(assetQuantities, confirmedQuantities);

  // 하단 액션 버튼 종류
  const bottomActionVariant =
    isEditMode && isEditChanged
      ? "editSubmit"
      : isEditMode
        ? "editCancel"
        : "purchase";

  const tradePageBottomPadding = hasAssetCountBar ? "pb-[240px]" : "pb-[176px]";

  const handleAssetClick = (assetId: InvestAssetId) => {
    const asset = allAssets.find((item) => item.id === assetId);
    const sector = asset ? sectorByCode.get(asset.sectorCode) : undefined;

    // 서버 섹터 목록에 없는 카드는 선택하지 않음
    if (!sector) return;

    setConfirmInvestmentErrorMessage("");
    setSelectedAssetId(assetId);

    setAssetQuantities((prev) => {
      const currentQuantity = prev[assetId] ?? 0;
      const currentTotalAmount = getTotalInvestAmount(prev, unitAmount);

      if (currentTotalAmount + unitAmount > serverTotalBudget) {
        return prev;
      }

      return {
        ...prev,
        [assetId]: currentQuantity + 1,
      };
    });
  };

  // 수량 감소
  const handleDecrease = () => {
    if (!selectedAssetId) return;

    setConfirmInvestmentErrorMessage("");

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

  // 수량 증가
  const handleIncrease = () => {
    if (!selectedAssetId || !canIncrease) return;

    setConfirmInvestmentErrorMessage("");

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
    setConfirmInvestmentErrorMessage("");
  };

  // 구매하기 버튼 -> 확인 바텀시트 오픈
  const handlePurchase = () => {
    if (!hasAnyInvestment) return;

    setConfirmInvestmentErrorMessage("");
    setIsConfirmSheetOpen(true);
  };

  // 구매 확정 또는 수정 확정
  const handleSubmitInvestment = async () => {
    if (isSubmittingInvestment) return;

    const requestBody = buildInvestmentBody();

    if (requestBody.sectors.length === 0) {
      setConfirmInvestmentErrorMessage("하나 이상의 섹터를 선택해주세요.");
      setIsConfirmSheetOpen(false);
      return;
    }

    try {
      setIsSubmittingInvestment(true);
      setConfirmInvestmentErrorMessage("");

      const data = isEditMode
        ? await updateInvestmentMutation.mutateAsync(requestBody)
        : await confirmInvestmentMutation.mutateAsync(requestBody);

      queryClient.setQueryData(investmentQueryKeys.today(), data);

      setConfirmedQuantities(assetQuantities);
      setSelectedAssetId(null);
      setIsConfirmSheetOpen(false);
      setIsCompleteModalOpen(true);
    } catch (error) {
      console.error(isEditMode ? "투자 수정 실패:" : "투자 확정 실패:", error);

      const message = getErrorMessage(
        error,
        isEditMode
          ? "투자 수정에 실패했어요. 잠시 후 다시 시도해주세요."
          : "투자 확정에 실패했어요. 잠시 후 다시 시도해주세요.",
      );

      setConfirmInvestmentErrorMessage(message);
      setIsConfirmSheetOpen(false);
    } finally {
      setIsSubmittingInvestment(false);
    }
  };

  const handleCompleteModalConfirm = () => {
    setIsCompleteModalOpen(false);
    setSelectedAssetId(null);
    setViewMode("summary");
  };

  const handleStartEdit = () => {
    if (!canEditTodayInvestment) return;

    const firstConfirmedAssetId =
      allAssets.find((asset) => (confirmedQuantities[asset.id] ?? 0) > 0)?.id ??
      null;

    setAssetQuantities(confirmedQuantities);
    setSelectedAssetId(firstConfirmedAssetId);
    setConfirmInvestmentErrorMessage("");
    setViewMode("edit");
  };

  const handleEditCancel = () => {
    setAssetQuantities(confirmedQuantities);
    setSelectedAssetId(null);
    setConfirmInvestmentErrorMessage("");
    setViewMode("summary");
  };

  // 수정 완료 버튼 -> 확인 바텀시트 오픈
  const handleEditSubmit = () => {
    if (!hasAnyInvestment || !isEditChanged) return;

    setConfirmInvestmentErrorMessage("");
    setIsConfirmSheetOpen(true);
  };

  return (
    <>
      {shouldShowWeekendClosedPage ? (
        <div className="-mb-[80px] flex flex-1 flex-col">
          <InvestWeekendClosedPage />
        </div>
      ) : viewMode === "summary" ? (
        <div className="-mb-[80px] flex flex-1 flex-col">
          <InvestTodayStatusPage
            items={todayStatusItems}
            onEdit={handleStartEdit}
            isClosed={isTodayClosed}
            confirmDeadline={todayInvestmentData?.confirmDeadline}
            nextInvestmentAvailableAt={
              todayInvestmentData?.nextInvestmentAvailableAt
            }
          />
        </div>
      ) : (
        <div
          className={[
            "-mb-[80px] flex flex-1 flex-col gap-5 bg-[var(--color-neutral-50)] px-5 pt-5",
            tradePageBottomPadding,
          ].join(" ")}
        >
          <InvestBudgetCard
            totalBudget={serverTotalBudget}
            remainingBudget={remainingBudget}
          />

          {sectorErrorMessage && (
            <p className="text-[length:var(--text-caption-12-md)] leading-[var(--text-caption-12-md--line-height)] font-[var(--text-caption-12-md--font-weight)] text-[var(--color-primary)]">
              {sectorErrorMessage}
            </p>
          )}

          {todayInvestmentErrorMessage && (
            <p className="text-[length:var(--text-caption-12-md)] leading-[var(--text-caption-12-md--line-height)] font-[var(--text-caption-12-md--font-weight)] text-[var(--color-primary)]">
              {todayInvestmentErrorMessage}
            </p>
          )}

          {confirmInvestmentErrorMessage && (
            <p className="text-[length:var(--text-caption-12-md)] leading-[var(--text-caption-12-md--line-height)] font-[var(--text-caption-12-md--font-weight)] text-[var(--color-primary)]">
              {confirmInvestmentErrorMessage}
            </p>
          )}

          {INVEST_ASSET_SECTIONS.map((section) => (
            <div key={section.id} className="flex flex-col gap-2">
              <h2 className="text-[length:var(--text-body-16-bd-tighter)] leading-[var(--text-body-16-bd-tighter--line-height)] font-[var(--text-body-16-bd-tighter--font-weight)] text-[var(--color-neutral-900)]">
                {section.title}
              </h2>

              <div className="grid grid-cols-4 gap-[10px]">
                {section.items.map((asset) => {
                  const quantity = assetQuantities[asset.id] ?? 0;
                  const sector = sectorByCode.get(asset.sectorCode);
                  const isDisabled = !sector;

                  const isSelected =
                    selectedAssetId === asset.id && quantity > 0;
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
                      onClick={() => {
                        if (isDisabled) return;
                        handleAssetClick(asset.id);
                      }}
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
            variant={bottomActionVariant}
            showTopShadow={!hasAssetCountBar}
            onReset={handleReset}
            onPurchase={handlePurchase}
            onEditCancel={handleEditCancel}
            onEditSubmit={handleEditSubmit}
          />
        </div>
      )}

      <InvestConfirmBottomSheet
        isOpen={isConfirmSheetOpen}
        items={confirmItems}
        totalAmount={totalInvestAmount}
        onClose={() => setIsConfirmSheetOpen(false)}
        onConfirm={handleSubmitInvestment}
      />

      <InvestCompleteModal
        isOpen={isCompleteModalOpen}
        onClose={() => setIsCompleteModalOpen(false)}
        onConfirm={handleCompleteModalConfirm}
      />
    </>
  );
}

export default InvestPage;