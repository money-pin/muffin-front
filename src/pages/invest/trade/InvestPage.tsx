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
import ErrorModal from "@/components/common/ErrorModal";

import { DEFAULT_ERROR_MESSAGE } from "@/lib/errorMessages";
import { useApiErrorModal } from "@/lib/useApiErrorModal";
import { INVEST_ASSET_SECTIONS } from "@/pages/invest/trade/constants/investAsset";
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

type AssetQuantityMap = Partial<Record<InvestAssetId, number>>;
type InvestScreenMode = "weekend" | "trade" | "status";

const FORCE_TRADE_VIEW_FOR_DEV = false;

const INVESTMENT_AVAILABLE_STATUSES = new Set([
  "AVAILABLE",
  "CONFIRMED",
  "CONFIRMED_EDITABLE",
]);

function getIsKstWeekend(date: Date) {
  const weekday = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Seoul",
    weekday: "short",
  }).format(date);

  return weekday === "Sat" || weekday === "Sun";
}

function getTotalInvestAmount(
  assetQuantities: AssetQuantityMap,
  unitAmount: number,
) {
  return Object.values(assetQuantities).reduce((sum, quantity) => {
    return sum + unitAmount * (quantity ?? 0);
  }, 0);
}

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

  // 오늘 투자 현황·섹터 목록 조회 실패 시 공용 에러 모달(확인/다시 시도)로 안내한다.
  // (랭킹·통계 화면과 동일한 useApiErrorModal + ErrorModal 패턴)
  const {
    error: apiErrorState,
    showError: showApiError,
    closeError: closeApiError,
    handlePrimaryAction: handleApiErrorAction,
  } = useApiErrorModal({
    onRetry: () => {
      void todayInvestmentQuery.refetch();
      void investmentSectorsQuery.refetch();
    },
  });

  useEffect(() => {
    if (todayInvestmentQuery.isError) {
      queueMicrotask(() => showApiError(todayInvestmentQuery.error));
      return;
    }
    if (investmentSectorsQuery.isError) {
      queueMicrotask(() => showApiError(investmentSectorsQuery.error));
    }
  }, [
    todayInvestmentQuery.isError,
    todayInvestmentQuery.error,
    investmentSectorsQuery.isError,
    investmentSectorsQuery.error,
    showApiError,
  ]);

  const [now, setNow] = useState(() => new Date());
  const [isEditMode, setIsEditMode] = useState(false);
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

  useEffect(() => {
    const refreshTimeAndStatus = () => {
      setNow(new Date());

      void queryClient.invalidateQueries({
        queryKey: investmentQueryKeys.today(),
      });
    };

    const timer = window.setInterval(refreshTimeAndStatus, 30_000);

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        refreshTimeAndStatus();
      }
    };

    window.addEventListener("focus", refreshTimeAndStatus);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.clearInterval(timer);
      window.removeEventListener("focus", refreshTimeAndStatus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [queryClient]);

  const isWeekend = getIsKstWeekend(now);

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
  const todayStatus = todayInvestmentData?.status ?? "";

  const todayInvestmentSectors = useMemo(
    () =>
      todayInvestmentData?.sectors ??
      todayInvestmentData?.previousInvestment?.sectors ??
      [],
    [
      todayInvestmentData?.sectors,
      todayInvestmentData?.previousInvestment?.sectors,
    ],
  );

  const hasServerInvestment = todayInvestmentSectors.some(
    (item) => item.quantity > 0,
  );

  const isInvestmentAvailable = INVESTMENT_AVAILABLE_STATUSES.has(todayStatus);

  const hasLocalConfirmedInvestment =
    isInvestmentAvailable &&
    Object.values(confirmedQuantities).some((quantity) => (quantity ?? 0) > 0);

  const hasConfirmedInvestment =
    hasServerInvestment || hasLocalConfirmedInvestment;

  const canEditTodayInvestment =
    hasConfirmedInvestment && isInvestmentAvailable;
  useEffect(() => {
    if (!todayInvestmentData || isEditMode) return;

    const hasInvestmentResponse =
      Array.isArray(todayInvestmentData.sectors) ||
      Array.isArray(todayInvestmentData.previousInvestment?.sectors);

    if (!hasInvestmentResponse) return;

    const nextConfirmedQuantities = todayInvestmentSectors.reduce(
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

    const hasInvestment = Object.keys(nextConfirmedQuantities).length > 0;

    queueMicrotask(() => {
      if (hasInvestment) {
        setConfirmedQuantities(nextConfirmedQuantities);
        setAssetQuantities(nextConfirmedQuantities);
        setSelectedAssetId(null);
        return;
      }

      if (todayStatus === "AVAILABLE") {
        setConfirmedQuantities({});
      }
    });
  }, [
    assetBySectorCode,
    isEditMode,
    todayInvestmentData,
    todayInvestmentSectors,
    todayStatus,
  ]);

  useEffect(() => {
    if (!isWeekend && isInvestmentAvailable) return;

    queueMicrotask(() => {
      setIsEditMode(false);
      setIsConfirmSheetOpen(false);
    });
  }, [isInvestmentAvailable, isWeekend]);

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

  const responseRemainingAmount = todayInvestmentData?.remainingAmount;
  const responseTotalAmount =
    todayInvestmentData?.totalAmount ??
    todayInvestmentData?.previousInvestment?.totalAmount;

  const serverTotalBudget =
    typeof responseRemainingAmount === "number" &&
    typeof responseTotalAmount === "number"
      ? responseRemainingAmount + responseTotalAmount
      : 0;

  const remainingBudget = Math.max(0, serverTotalBudget - totalInvestAmount);

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

  const serverTodayStatusItems = todayInvestmentSectors.flatMap((item) => {
    const asset = assetBySectorCode.get(item.sectorCode);

    if (!asset || item.quantity <= 0) return [];

    return {
      assetId: asset.id,
      name: item.sectorName,
      icon: asset.activeIcon,
      amount: item.amount,
      percentage: Math.round(item.ratio),
    };
  });

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
      : isInvestmentAvailable
        ? localTodayStatusItems
        : [];

  const screenMode: InvestScreenMode = (() => {
    if (FORCE_TRADE_VIEW_FOR_DEV) return "trade";

    // 주말
    if (isWeekend) return "weekend";

    // 투자 가능한 시간에 사용자가 수정 화면에 진입한 경우
    if (isEditMode && isInvestmentAvailable) return "trade";

    // 투자 여부와 관계없이, 이미 확정한 내역이 있으면 현황 화면
    if (hasConfirmedInvestment) return "status";

    // 투자하지 않았고 투자 가능한 시간이면 투자 선택 화면
    if (isInvestmentAvailable) return "trade";

    return "status";
  })();

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
  const isEditChanged =
    isEditMode && !isSameQuantityMap(assetQuantities, confirmedQuantities);

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

  const handlePurchase = () => {
    if (!hasAnyInvestment || !isInvestmentAvailable) return;

    setConfirmInvestmentErrorMessage("");
    setIsConfirmSheetOpen(true);
  };

  const handleSubmitInvestment = async () => {
    if (isSubmittingInvestment || !isInvestmentAvailable) return;

    const requestBody = buildInvestmentBody();

    if (requestBody.sectors.length === 0) {
      setConfirmInvestmentErrorMessage("하나 이상의 섹터를 선택해주세요.");
      setIsConfirmSheetOpen(false);
      return;
    }

    try {
      setIsSubmittingInvestment(true);
      setConfirmInvestmentErrorMessage("");

      if (isEditMode) {
        await updateInvestmentMutation.mutateAsync(requestBody);
      } else {
        await confirmInvestmentMutation.mutateAsync(requestBody);
      }
      void queryClient.invalidateQueries({
        queryKey: investmentQueryKeys.today(),
      });

      setConfirmedQuantities({ ...assetQuantities });
      setSelectedAssetId(null);
      setIsEditMode(false);
      setIsConfirmSheetOpen(false);
      setIsCompleteModalOpen(true);
    } catch (error) {
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
  };

  const handleStartEdit = () => {
    if (!canEditTodayInvestment) return;

    const firstConfirmedAssetId =
      allAssets.find((asset) => (confirmedQuantities[asset.id] ?? 0) > 0)?.id ??
      null;

    setAssetQuantities(confirmedQuantities);
    setSelectedAssetId(firstConfirmedAssetId);
    setConfirmInvestmentErrorMessage("");
    setIsEditMode(true);
  };

  const handleEditCancel = () => {
    setAssetQuantities(confirmedQuantities);
    setSelectedAssetId(null);
    setConfirmInvestmentErrorMessage("");
    setIsEditMode(false);
  };

  const handleEditSubmit = () => {
    if (!hasAnyInvestment || !isEditChanged || !canEditTodayInvestment) {
      return;
    }

    setConfirmInvestmentErrorMessage("");
    setIsConfirmSheetOpen(true);
  };

  if (screenMode === "weekend") {
    return (
      <div className="-mb-[80px] flex flex-1 flex-col">
        <InvestWeekendClosedPage />
      </div>
    );
  }

  //로딩 임시
  if (todayInvestmentQuery.isPending && !todayInvestmentData) {
    return (
      <div className="-mb-[80px] flex flex-1 items-center justify-center bg-[var(--color-neutral-50)] px-5">
        <p className="text-body-14-md text-neutral-400">
          오늘 투자 현황을 불러오는 중이에요.
        </p>
      </div>
    );
  }

  if (todayInvestmentQuery.isError && !todayInvestmentData) {
    return (
      <>
        <div className="-mb-[80px] flex flex-1 bg-[var(--color-neutral-50)] px-5" />
        <ErrorModal
          isOpen={!!apiErrorState}
          info={apiErrorState?.info ?? DEFAULT_ERROR_MESSAGE}
          onPrimaryAction={handleApiErrorAction}
          onSecondaryAction={closeApiError}
          onClose={closeApiError}
          isLoading={todayInvestmentQuery.isFetching}
        />
      </>
    );
  }

  if (
    screenMode === "trade" &&
    investmentSectorsQuery.isPending &&
    !sectorData
  ) {
    return (
      <div className="-mb-[80px] flex flex-1 items-center justify-center bg-[var(--color-neutral-50)] px-5">
        <p className="text-body-14-md text-neutral-400">
          투자 항목을 불러오는 중이에요.
        </p>
      </div>
    );
  }

  if (screenMode === "trade" && investmentSectorsQuery.isError && !sectorData) {
    return (
      <>
        <div className="-mb-[80px] flex flex-1 bg-[var(--color-neutral-50)] px-5" />
        <ErrorModal
          isOpen={!!apiErrorState}
          info={apiErrorState?.info ?? DEFAULT_ERROR_MESSAGE}
          onPrimaryAction={handleApiErrorAction}
          onSecondaryAction={closeApiError}
          onClose={closeApiError}
          isLoading={investmentSectorsQuery.isFetching}
        />
      </>
    );
  }

  return (
    <>
      {screenMode === "status" ? (
        <div className="-mb-[80px] flex flex-1 flex-col">
          <InvestTodayStatusPage
            items={todayStatusItems}
            onEdit={handleStartEdit}
            isClosed={!isInvestmentAvailable}
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
