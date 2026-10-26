import { useEffect, useMemo, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useBottomNavigationVisibility } from "@/layouts/bottomNavigationContext";

import InvestAssetCard from "@/pages/invest/trade/components/InvestAssetCard";
import InvestAssetSectionLayout from "@/pages/invest/trade/components/InvestAssetSectionLayout";
import InvestAssetCountBar from "@/pages/invest/trade/components/InvestAssetCountBar";
import InvestBottomAction from "@/pages/invest/trade/components/InvestBottomAction";
import InvestBudgetCard from "@/pages/invest/trade/components/InvestBudgetCard";
import InvestCompleteModal from "@/pages/invest/trade/components/InvestCompleteModal";
import InvestConfirmBottomSheet from "@/pages/invest/trade/components/InvestConfirmBottomSheet";
import InvestTodayStatusPage from "@/pages/invest/trade/components/InvestTodayStatusPage";
import InvestWeekendClosedPage from "@/pages/invest/trade/components/InvestWeekendClosedPage";
import ErrorModal from "@/components/common/ErrorModal";

import { DEFAULT_ERROR_MESSAGE } from "@/lib/errorMessages";
import { useInvestmentSubmission } from "@/pages/invest/trade/hooks/useInvestmentSubmission";
import { useInvestmentQueryError } from "@/pages/invest/trade/hooks/useInvestmentQueryError";
import { INVESTMENT_AVAILABLE_STATUSES } from "@/pages/invest/trade/constants/investmentStatus";
import { INVEST_ASSET_SECTIONS } from "@/pages/invest/trade/constants/investAsset";
import { useInvestmentSelection } from "@/pages/invest/trade/hooks/useInvestmentSelection";
import {
  investmentQueryKeys,
  useInvestmentSectorsQuery,
  useTodayInvestmentQuery,
} from "@/pages/invest/trade/investQueries";
import {
  createInvestmentSummaryItems,
  getInvestmentBudget,
} from "@/pages/invest/trade/utils/investmentSelection";

import type {
  InvestAssetId,
  InvestmentQuantityMap,
} from "@/pages/invest/trade/types/invest";

type InvestScreenMode = "weekend" | "trade" | "status";

function getIsKstWeekend(date: Date) {
  const weekday = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Seoul",
    weekday: "short",
  }).format(date);

  return weekday === "Sat" || weekday === "Sun";
}

function InvestPage() {
  const queryClient = useQueryClient();
  const countBarRef = useRef<HTMLDivElement>(null);
  const bottomActionRef = useRef<HTMLDivElement>(null);

  const investmentSectorsQuery = useInvestmentSectorsQuery();
  const todayInvestmentQuery = useTodayInvestmentQuery();

  const sectorData = investmentSectorsQuery.data ?? null;
  const todayInvestmentData = todayInvestmentQuery.data ?? null;

  const [now, setNow] = useState(() => new Date());
  const [isEditMode, setIsEditMode] = useState(false);
  const [isQuantityBarReady, setIsQuantityBarReady] = useState(false);
  const [isQuantityKeyboardOpen, setIsQuantityKeyboardOpen] = useState(false);
  const [isQuantityEditing, setIsQuantityEditing] = useState(false);
  const setNavigationHidden = useBottomNavigationVisibility();

  useEffect(() => {
    const refreshTimeAndStatus = () => {
      setNow(new Date());

      // 포커스·탭 복귀·주기 갱신이 겹쳐도 진행 중인 조회를 재시작하지 않는다.
      void queryClient.invalidateQueries(
        { queryKey: investmentQueryKeys.today() },
        { cancelRefetch: false },
      );
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

  const assetById = useMemo(
    () => new Map(allAssets.map((asset) => [asset.id, asset])),
    [allAssets],
  );

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

  const serverQuantities = useMemo(
    () =>
      todayInvestmentSectors.reduce<InvestmentQuantityMap>(
        (quantities, item) => {
          const asset = assetBySectorCode.get(item.sectorCode);
          if (asset && item.quantity > 0) quantities[asset.id] = item.quantity;
          return quantities;
        },
        {},
      ),
    [assetBySectorCode, todayInvestmentSectors],
  );
  const serverTotalBudget = getInvestmentBudget(todayInvestmentData) ?? 0;

  const {
    quantities: assetQuantities,
    selectedAssetId,
    selectedQuantity,
    selectedMaxQuantity,
    setSelectedQuantity,
    addSelectedQuantity,
    selectedTotalAmount: selectedAssetTotalAmount,
    totalAmount: totalInvestAmount,
    remainingBudget,
    hasInvestment: hasAnyInvestment,
    isChanged,
    isWithinBudget,
    canDecrease,
    canIncrease,
    toggleAssetSelection,
    incrementSelectedAsset,
    decrementSelectedAsset,
    replaceQuantities,
    resetSelection,
  } = useInvestmentSelection({ unitAmount, totalBudget: serverTotalBudget });

  const {
    isSubmittingInvestment,
    isConfirmSheetOpen,
    setIsConfirmSheetOpen,
    isCompleteModalOpen,
    setIsCompleteModalOpen,
    confirmInvestmentErrorMessage,
    setConfirmInvestmentErrorMessage,
    pendingConfirmedQuantities,
    investmentErrorState,
    closeInvestmentError,
    handleInvestmentErrorAction,
    handleSubmitInvestment,
    closeConfirmation,
  } = useInvestmentSubmission({
    assetQuantities,
    assetById,
    unitAmount,
    isEditMode,
    isInvestmentAvailable,
    isWeekend,
    isWithinBudget,
    onConfirmed: (quantities) => {
      replaceQuantities(quantities);
      setIsEditMode(false);
    },
  });

  const confirmedQuantities = pendingConfirmedQuantities ?? serverQuantities;
  const hasConfirmedInvestment =
    hasServerInvestment || Object.keys(confirmedQuantities).length > 0;
  const canEditTodayInvestment =
    hasConfirmedInvestment && isInvestmentAvailable;

  useEffect(() => {
    if (!isWeekend && isInvestmentAvailable) return;

    queueMicrotask(() => {
      setIsEditMode(false);
      setIsConfirmSheetOpen(false);
      closeInvestmentError();
    });
  }, [
    isInvestmentAvailable,
    isWeekend,
    closeInvestmentError,
    setIsConfirmSheetOpen,
  ]);

  const selectedAsset = useMemo(() => {
    return selectedAssetId ? assetById.get(selectedAssetId) : undefined;
  }, [assetById, selectedAssetId]);

  const confirmItems = createInvestmentSummaryItems(
    assetQuantities,
    assetById,
    unitAmount,
  );

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

  const todayStatusItems = pendingConfirmedQuantities
    ? createInvestmentSummaryItems(
        pendingConfirmedQuantities,
        assetById,
        unitAmount,
      )
    : serverTodayStatusItems;

  const screenMode: InvestScreenMode = (() => {
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

  const needsSectorData = screenMode === "trade";
  const {
    apiErrorState,
    closeApiError,
    handleApiErrorAction,
    isRetryingQuery,
    relevantQueryFailed,
    retryQueries,
  } = useInvestmentQueryError({
    todayInvestmentQuery,
    investmentSectorsQuery,
    needsSectorData,
  });

  const hasAssetCountBar = Boolean(selectedAsset && selectedQuantity > 0);
  const isInputActive =
    screenMode === "trade" && hasAssetCountBar && isQuantityKeyboardOpen;
  useEffect(() => {
    setNavigationHidden(isInputActive);
    return () => setNavigationHidden(false);
  }, [isInputActive, setNavigationHidden]);
  const isEditChanged = isEditMode && isChanged;

  const bottomActionVariant =
    isEditMode && isEditChanged
      ? "editSubmit"
      : isEditMode
        ? "editCancel"
        : "purchase";

  const tradePageBottomPadding = hasAssetCountBar ? "pb-[300px]" : "pb-[176px]";

  const handleAssetClick = (assetId: InvestAssetId) => {
    const asset = assetById.get(assetId);
    const sector = asset ? sectorByCode.get(asset.sectorCode) : undefined;

    if (!sector || !isInvestmentAvailable || isSubmittingInvestment) return;

    setConfirmInvestmentErrorMessage("");
    toggleAssetSelection(assetId);
  };

  const handleDecrease = () => {
    if (!isInvestmentAvailable || isSubmittingInvestment) return;

    setConfirmInvestmentErrorMessage("");

    decrementSelectedAsset();
  };

  const handleIncrease = () => {
    if (!isInvestmentAvailable || isSubmittingInvestment) return;

    setConfirmInvestmentErrorMessage("");

    incrementSelectedAsset();
  };

  const handleQuantityAdd = (quantity: number) => {
    if (!isInvestmentAvailable || isSubmittingInvestment) return;
    setConfirmInvestmentErrorMessage("");
    addSelectedQuantity(quantity);
  };

  const handleQuantityChange = (quantity: number) => {
    if (!isInvestmentAvailable || isSubmittingInvestment) return;
    setConfirmInvestmentErrorMessage("");
    setSelectedQuantity(quantity);
  };

  const handleReset = () => {
    if (isSubmittingInvestment) return;
    resetSelection();
    setConfirmInvestmentErrorMessage("");
  };

  const handlePurchase = () => {
    if (
      !hasAnyInvestment ||
      !isWithinBudget ||
      !isInvestmentAvailable ||
      isSubmittingInvestment
    )
      return;

    setConfirmInvestmentErrorMessage("");
    setIsConfirmSheetOpen(true);
  };

  const handleCompleteModalConfirm = () => {
    setIsCompleteModalOpen(false);
  };

  const handleStartEdit = () => {
    if (!canEditTodayInvestment) return;

    replaceQuantities(confirmedQuantities);
    setConfirmInvestmentErrorMessage("");
    setIsEditMode(true);
  };

  const handleEditCancel = () => {
    if (isSubmittingInvestment) return;
    replaceQuantities(confirmedQuantities);
    setConfirmInvestmentErrorMessage("");
    setIsEditMode(false);
  };

  const handleEditSubmit = () => {
    if (
      !hasAnyInvestment ||
      !isWithinBudget ||
      !isEditChanged ||
      !canEditTodayInvestment ||
      isSubmittingInvestment
    ) {
      return;
    }

    setConfirmInvestmentErrorMessage("");
    setIsConfirmSheetOpen(true);
  };

  // 캐시된 내역을 유지한 재조회 실패도 동일한 모달로 안내한다.
  // 완료 안내와 겹치지 않도록 완료 모달을 닫은 뒤 오류를 표시한다.
  const apiErrorModal = (
    <ErrorModal
      isOpen={!!apiErrorState && !isCompleteModalOpen && !investmentErrorState}
      info={apiErrorState?.info ?? DEFAULT_ERROR_MESSAGE}
      onPrimaryAction={handleApiErrorAction}
      onSecondaryAction={closeApiError}
      onClose={closeApiError}
      isLoading={isRetryingQuery}
    />
  );

  const queryFailureNotice =
    relevantQueryFailed && todayInvestmentData ? (
      <div
        role="status"
        className="bg-neutral-0 flex flex-wrap items-center justify-between gap-2 rounded-xl p-4"
      >
        <p className="text-body-14-md text-neutral-600">
          최신 투자 정보를 불러오지 못했어요.
        </p>
        <button
          type="button"
          disabled={isRetryingQuery}
          onClick={() => {
            void retryQueries();
          }}
          className="text-body-14-bd text-primary min-h-11 disabled:opacity-40"
        >
          {isRetryingQuery ? "다시 조회 중..." : "다시 시도"}
        </button>
      </div>
    ) : null;

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
        {apiErrorModal}
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
        {apiErrorModal}
      </>
    );
  }

  return (
    <>
      {screenMode === "status" ? (
        <div
          aria-busy={todayInvestmentQuery.isFetching}
          className="-mb-[80px] flex flex-1 flex-col"
        >
          {queryFailureNotice && (
            <div className="bg-neutral-50 px-5 pt-5">{queryFailureNotice}</div>
          )}
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
          data-invest-trade
          aria-busy={todayInvestmentQuery.isFetching}
          className={[
            "-mb-[80px] flex flex-1 flex-col gap-5 bg-[var(--color-neutral-50)] px-5 pt-5 [overflow-anchor:none]",
            tradePageBottomPadding,
          ].join(" ")}
        >
          <InvestBudgetCard
            totalBudget={serverTotalBudget}
            remainingBudget={remainingBudget}
          />

          {queryFailureNotice}

          {confirmInvestmentErrorMessage && (
            <p className="text-[length:var(--text-caption-12-md)] leading-[var(--text-caption-12-md--line-height)] font-[var(--text-caption-12-md--font-weight)] text-[var(--color-primary)]">
              {confirmInvestmentErrorMessage}
            </p>
          )}

          <InvestAssetSectionLayout
            hasSelection={hasAssetCountBar}
            onReadyChange={setIsQuantityBarReady}
            controlsRef={hasAssetCountBar ? countBarRef : bottomActionRef}
          >
            {INVEST_ASSET_SECTIONS.map((section) => (
              <section
                key={section.id}
                aria-label={section.title}
                className="flex flex-col"
              >
                <div
                  data-invest-section-heading
                  className="visible h-[var(--invest-title-height,auto)] overflow-hidden opacity-100 transition-[height,opacity,visibility] duration-300 ease-[ease-out] group-data-[compact=true]/sections:invisible group-data-[compact=true]/sections:h-0 group-data-[compact=true]/sections:opacity-0 motion-reduce:transition-none"
                >
                  <h2 className="text-body-16-bd-tighter pb-2 text-neutral-900">
                    {section.title}
                  </h2>
                </div>

                <div
                  data-invest-card-row
                  className="grid grid-cols-4 gap-[10px]"
                >
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
              </section>
            ))}
          </InvestAssetSectionLayout>

          {selectedAsset && selectedQuantity > 0 && (
            <InvestAssetCountBar
              key={selectedAsset.id}
              containerRef={countBarRef}
              isVisible={isQuantityBarReady}
              onKeyboardVisibilityChange={setIsQuantityKeyboardOpen}
              onEditingChange={setIsQuantityEditing}
              name={selectedAsset.name}
              totalAmount={selectedAssetTotalAmount}
              quantity={selectedQuantity}
              maxQuantity={selectedMaxQuantity}
              disabled={isSubmittingInvestment || !isInvestmentAvailable}
              canDecrease={canDecrease}
              canIncrease={canIncrease}
              onDecrease={handleDecrease}
              onIncrease={handleIncrease}
              onQuantityAdd={handleQuantityAdd}
              onQuantityChange={handleQuantityChange}
            />
          )}

          {!isInputActive && !(hasAssetCountBar && isQuantityEditing) && (
            <InvestBottomAction
              containerRef={bottomActionRef}
              selectedTotalAmount={totalInvestAmount}
              variant={bottomActionVariant}
              disabled={
                isSubmittingInvestment ||
                !isInvestmentAvailable ||
                (bottomActionVariant !== "editCancel" &&
                  (!hasAnyInvestment || !isWithinBudget))
              }
              resetDisabled={isSubmittingInvestment}
              showTopShadow={!hasAssetCountBar}
              onReset={handleReset}
              onAction={
                bottomActionVariant === "editCancel"
                  ? handleEditCancel
                  : bottomActionVariant === "editSubmit"
                    ? handleEditSubmit
                    : handlePurchase
              }
            />
          )}
        </div>
      )}

      <InvestConfirmBottomSheet
        isOpen={isConfirmSheetOpen}
        isSubmitting={isSubmittingInvestment}
        items={confirmItems}
        totalAmount={totalInvestAmount}
        onClose={closeConfirmation}
        onConfirm={() => {
          void handleSubmitInvestment();
        }}
      />

      <InvestCompleteModal
        isOpen={isCompleteModalOpen}
        onClose={() => setIsCompleteModalOpen(false)}
        onConfirm={handleCompleteModalConfirm}
      />
      {apiErrorModal}
      <ErrorModal
        isOpen={!!investmentErrorState}
        info={investmentErrorState?.info ?? DEFAULT_ERROR_MESSAGE}
        onPrimaryAction={handleInvestmentErrorAction}
        onSecondaryAction={closeInvestmentError}
        onClose={closeInvestmentError}
        isLoading={isSubmittingInvestment}
      />
    </>
  );
}

export default InvestPage;
