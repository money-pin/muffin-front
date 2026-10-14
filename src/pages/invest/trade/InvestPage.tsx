import { useEffect, useMemo, useRef, useState } from "react";
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

import { ApiError } from "@/lib/api";
import { DEFAULT_ERROR_MESSAGE } from "@/lib/errorMessages";
import { useApiErrorModal } from "@/lib/useApiErrorModal";
import { INVEST_ASSET_SECTIONS } from "@/pages/invest/trade/constants/investAsset";
import { getTodayInvestment } from "@/pages/invest/trade/apis/investmentApi";
import { useInvestmentSelection } from "@/pages/invest/trade/hooks/useInvestmentSelection";
import {
  investmentQueryKeys,
  useConfirmInvestmentMutation,
  useInvestmentSectorsQuery,
  useTodayInvestmentQuery,
  useUpdateInvestmentMutation,
} from "@/pages/invest/trade/investQueries";
import {
  createInvestmentRequest,
  createInvestmentSummaryItems,
  getInvestmentBudget,
  getTotalInvestAmount,
  isSameInvestmentRequest,
} from "@/pages/invest/trade/utils/investmentSelection";

import type {
  InvestAssetId,
  InvestmentQuantityMap,
  ConfirmInvestmentRequest,
} from "@/pages/invest/trade/types/invest";

type InvestScreenMode = "weekend" | "trade" | "status";

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

function getKstDateKey(date: Date) {
  return new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Seoul" }).format(
    date,
  );
}

function InvestPage() {
  const queryClient = useQueryClient();

  const investmentSectorsQuery = useInvestmentSectorsQuery();
  const todayInvestmentQuery = useTodayInvestmentQuery();
  const confirmInvestmentMutation = useConfirmInvestmentMutation();
  const updateInvestmentMutation = useUpdateInvestmentMutation();

  const sectorData = investmentSectorsQuery.data ?? null;
  const todayInvestmentData = todayInvestmentQuery.data ?? null;

  const [isRetryingQuery, setIsRetryingQuery] = useState(false);
  const queryRetryLock = useRef(false);
  const notifiedErrors = useRef({ today: false, sectors: false });
  const failedSubmission = useRef<{
    body: ConfirmInvestmentRequest;
    quantities: InvestmentQuantityMap;
    isEdit: boolean;
    dateKey: string;
  } | null>(null);

  // 동일 조회의 연속 실패는 한 번만 모달로 알리고 인라인 재시도를 유지한다.
  // (랭킹·통계 화면과 동일한 useApiErrorModal + ErrorModal 패턴)
  const {
    error: apiErrorState,
    showError: showApiError,
    closeError: closeApiError,
    handlePrimaryAction: handleApiErrorAction,
  } = useApiErrorModal({
    onRetry: () => {
      void retryQueries();
    },
  });

  // 응답 유실 가능성이 있는 제출은 서버 반영 여부부터 확인한다.
  const {
    error: investmentErrorState,
    showError: showInvestmentError,
    closeError: closeInvestmentError,
    handlePrimaryAction: handleInvestmentErrorAction,
  } = useApiErrorModal({
    useServerMessageForUnknownClientErrors: true,
    onRetry: () => {
      void handleSubmitInvestment(true);
    },
  });

  const [now, setNow] = useState(() => new Date());
  const [isEditMode, setIsEditMode] = useState(false);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  // 제출 성공 직후 재조회가 끝나기 전까지 표시할 내역. 이후에는 서버 응답을 사용한다.
  const [submittedInvestment, setSubmittedInvestment] = useState<{
    sourceUpdateCount: number;
    quantities: InvestmentQuantityMap;
  } | null>(null);
  const [isConfirmSheetOpen, setIsConfirmSheetOpen] = useState(false);
  const [confirmInvestmentErrorMessage, setConfirmInvestmentErrorMessage] =
    useState("");
  const submissionLock = useRef(false);
  const [isSubmittingInvestment, setIsSubmittingInvestment] = useState(false);

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
  const pendingConfirmedQuantities =
    isInvestmentAvailable &&
    submittedInvestment !== null &&
    submittedInvestment.sourceUpdateCount ===
      queryClient.getQueryState(investmentQueryKeys.today())?.dataUpdateCount
      ? submittedInvestment.quantities
      : null;
  const confirmedQuantities = pendingConfirmedQuantities ?? serverQuantities;
  const hasConfirmedInvestment =
    hasServerInvestment || Object.keys(confirmedQuantities).length > 0;
  const canEditTodayInvestment =
    hasConfirmedInvestment && isInvestmentAvailable;

  const serverTotalBudget = getInvestmentBudget(todayInvestmentData) ?? 0;

  const {
    quantities: assetQuantities,
    selectedAssetId,
    selectedQuantity,
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

  useEffect(() => {
    if (!isWeekend && isInvestmentAvailable) return;

    queueMicrotask(() => {
      setIsEditMode(false);
      setIsConfirmSheetOpen(false);
      closeInvestmentError();
    });
  }, [isInvestmentAvailable, isWeekend, closeInvestmentError]);

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
  const relevantQueryFailed =
    todayInvestmentQuery.isError ||
    (needsSectorData && investmentSectorsQuery.isError);

  async function retryQueries() {
    if (queryRetryLock.current) return;
    queryRetryLock.current = true;
    setIsRetryingQuery(true);
    notifiedErrors.current = { today: false, sectors: false };
    try {
      await Promise.all([
        todayInvestmentQuery.refetch({ cancelRefetch: false }),
        ...(needsSectorData
          ? [investmentSectorsQuery.refetch({ cancelRefetch: false })]
          : []),
      ]);
    } finally {
      queryRetryLock.current = false;
      setIsRetryingQuery(false);
    }
  }

  useEffect(() => {
    if (todayInvestmentQuery.isSuccess) notifiedErrors.current.today = false;
    if (investmentSectorsQuery.isSuccess)
      notifiedErrors.current.sectors = false;
    if (todayInvestmentQuery.isError && !notifiedErrors.current.today) {
      notifiedErrors.current.today = true;
      queueMicrotask(() => showApiError(todayInvestmentQuery.error));
    } else if (
      needsSectorData &&
      investmentSectorsQuery.isError &&
      !notifiedErrors.current.sectors
    ) {
      notifiedErrors.current.sectors = true;
      queueMicrotask(() => showApiError(investmentSectorsQuery.error));
    }
  }, [
    todayInvestmentQuery.isSuccess,
    todayInvestmentQuery.isError,
    todayInvestmentQuery.error,
    investmentSectorsQuery.isSuccess,
    investmentSectorsQuery.isError,
    investmentSectorsQuery.error,
    needsSectorData,
    showApiError,
  ]);

  useEffect(() => {
    if (apiErrorState && !relevantQueryFailed && !isRetryingQuery)
      queueMicrotask(closeApiError);
  }, [apiErrorState, relevantQueryFailed, isRetryingQuery, closeApiError]);

  const hasAssetCountBar = Boolean(selectedAsset && selectedQuantity > 0);
  const isEditChanged = isEditMode && isChanged;

  const bottomActionVariant =
    isEditMode && isEditChanged
      ? "editSubmit"
      : isEditMode
        ? "editCancel"
        : "purchase";

  const tradePageBottomPadding = hasAssetCountBar ? "pb-[240px]" : "pb-[176px]";

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

  const handleSubmitInvestment = async (retry = false) => {
    if (submissionLock.current || !isInvestmentAvailable || isWeekend) return;

    const pending = failedSubmission.current;
    const quantities = retry && pending ? pending.quantities : assetQuantities;
    const requestBody =
      retry && pending
        ? pending.body
        : createInvestmentRequest(quantities, assetById);
    const isEdit = retry && pending ? pending.isEdit : isEditMode;

    if (requestBody.sectors.length === 0) {
      setConfirmInvestmentErrorMessage("하나 이상의 섹터를 선택해주세요.");
      setIsConfirmSheetOpen(false);
      return;
    }

    if (!pending && !isWithinBudget) {
      setConfirmInvestmentErrorMessage(
        "투자 가능 금액을 확인하고 수량을 조정해주세요.",
      );
      setIsConfirmSheetOpen(false);
      return;
    }

    try {
      submissionLock.current = true;
      setIsSubmittingInvestment(true);
      setConfirmInvestmentErrorMessage("");

      if (pending) {
        if (pending.dateKey !== getKstDateKey(new Date())) {
          failedSubmission.current = null;
          throw new ApiError(
            "투자 날짜가 바뀌었어요. 오늘 내역을 다시 확인해주세요.",
            "INVESTMENT_400_001",
          );
        }
        // 실패한 제출 전에 시작된 GET을 재사용하면 오래된 내역으로 재전송할 수 있다.
        await queryClient.cancelQueries({
          queryKey: investmentQueryKeys.today(),
        });
        // 제출 재시도는 오프라인에서도 대기열에 남기지 않고 즉시 실패 처리한다.
        const checked = await queryClient.fetchQuery({
          queryKey: investmentQueryKeys.today(),
          queryFn: getTodayInvestment,
          staleTime: 0,
          retry: false,
          networkMode: "always",
        });
        // 이전 날짜의 previousInvestment는 오늘 요청의 성공 증거로 쓰지 않는다.
        const alreadySaved = isSameInvestmentRequest(
          requestBody,
          checked.sectors ?? [],
        );
        if (alreadySaved) {
          // 현재 확정하려는 수량과 일치할 때만 완료로 처리한다.
          failedSubmission.current = null;
          replaceQuantities(quantities);
          setIsEditMode(false);
          setIsConfirmSheetOpen(false);
          closeInvestmentError();
          setIsCompleteModalOpen(true);
          return;
        }
        if (!INVESTMENT_AVAILABLE_STATUSES.has(checked.status)) {
          failedSubmission.current = null;
          throw new ApiError(
            "현재는 투자할 수 없는 시간이에요.",
            "INVESTMENT_400_001",
          );
        }
        if (
          !isEdit &&
          (checked.status !== "AVAILABLE" ||
            (checked.sectors ?? []).some((item) => item.quantity > 0))
        ) {
          failedSubmission.current = null;
          throw new ApiError(
            "이미 확정된 투자 내역을 확인해주세요.",
            "INVESTMENT_409_001",
          );
        }
        const budget = getInvestmentBudget(checked);
        if (budget === null)
          throw new Error("투자 가능 금액을 확인하지 못했어요.");
        if (getTotalInvestAmount(quantities, unitAmount) > budget) {
          throw new ApiError(
            "투자 가능 금액을 확인해주세요.",
            "INVESTMENT_400_003",
          );
        }
      }
      failedSubmission.current = {
        body: requestBody,
        quantities: { ...quantities },
        isEdit,
        dateKey: getKstDateKey(new Date()),
      };
      if (isEdit) {
        await updateInvestmentMutation.mutateAsync(requestBody);
      } else {
        await confirmInvestmentMutation.mutateAsync(requestBody);
      }
      failedSubmission.current = null;
      // 진행 중인 이전 조회를 취소한 뒤, 다음 조회 성공까지 확정 수량을 유지한다.
      await queryClient.cancelQueries({
        queryKey: investmentQueryKeys.today(),
      });
      setSubmittedInvestment({
        sourceUpdateCount:
          queryClient.getQueryState(investmentQueryKeys.today())
            ?.dataUpdateCount ?? 0,
        quantities: { ...quantities },
      });
      replaceQuantities(quantities);
      setIsEditMode(false);
      setIsConfirmSheetOpen(false);
      closeInvestmentError();
      setIsCompleteModalOpen(true);
      void queryClient.invalidateQueries({
        queryKey: investmentQueryKeys.today(),
      });
    } catch (error) {
      setIsConfirmSheetOpen(false);
      showInvestmentError(error);
    } finally {
      submissionLock.current = false;
      setIsSubmittingInvestment(false);
    }
  };

  const handleCompleteModalConfirm = () => {
    setIsCompleteModalOpen(false);
  };

  const handleStartEdit = () => {
    if (!canEditTodayInvestment) return;

    const firstConfirmedAssetId =
      allAssets.find((asset) => (confirmedQuantities[asset.id] ?? 0) > 0)?.id ??
      null;

    replaceQuantities(confirmedQuantities, firstConfirmedAssetId);
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
          aria-busy={todayInvestmentQuery.isFetching}
          className={[
            "-mb-[80px] flex flex-1 flex-col gap-5 bg-[var(--color-neutral-50)] px-5 pt-5",
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
        </div>
      )}

      <InvestConfirmBottomSheet
        isOpen={isConfirmSheetOpen}
        isSubmitting={isSubmittingInvestment}
        items={confirmItems}
        totalAmount={totalInvestAmount}
        onClose={() => {
          if (!submissionLock.current) setIsConfirmSheetOpen(false);
        }}
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
