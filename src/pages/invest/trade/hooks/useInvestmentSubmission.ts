import { useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { ApiError } from "@/lib/api";
import { useApiErrorModal } from "@/lib/useApiErrorModal";
import { getTodayInvestment } from "@/pages/invest/trade/apis/investmentApi";
import { INVESTMENT_AVAILABLE_STATUSES } from "@/pages/invest/trade/constants/investmentStatus";
import {
  investmentQueryKeys,
  useConfirmInvestmentMutation,
  useUpdateInvestmentMutation,
} from "@/pages/invest/trade/investQueries";
import {
  createInvestmentRequest,
  getInvestmentBudget,
  getTotalInvestAmount,
  isSameInvestmentRequest,
} from "@/pages/invest/trade/utils/investmentSelection";
import type {
  ConfirmInvestmentRequest,
  InvestAssetId,
  InvestAssetMeta,
  InvestmentQuantityMap,
} from "@/pages/invest/trade/types/invest";

interface UseInvestmentSubmissionOptions {
  assetQuantities: InvestmentQuantityMap;
  assetById: ReadonlyMap<InvestAssetId, InvestAssetMeta>;
  unitAmount: number;
  isEditMode: boolean;
  isInvestmentAvailable: boolean;
  isWeekend: boolean;
  isWithinBudget: boolean;
  onConfirmed: (quantities: InvestmentQuantityMap) => void;
}

function getKstDateKey(date: Date) {
  return new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Seoul" }).format(
    date,
  );
}

// 제출 잠금, 응답 유실 후 복구, 재조회 전 임시 확정 내역을 관리한다.
export function useInvestmentSubmission({
  assetQuantities,
  assetById,
  unitAmount,
  isEditMode,
  isInvestmentAvailable,
  isWeekend,
  isWithinBudget,
  onConfirmed,
}: UseInvestmentSubmissionOptions) {
  const queryClient = useQueryClient();
  const confirmInvestmentMutation = useConfirmInvestmentMutation();
  const updateInvestmentMutation = useUpdateInvestmentMutation();

  const failedSubmission = useRef<{
    body: ConfirmInvestmentRequest;
    quantities: InvestmentQuantityMap;
    isEdit: boolean;
    dateKey: string;
  } | null>(null);

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

  const pendingConfirmedQuantities =
    isInvestmentAvailable &&
    submittedInvestment !== null &&
    submittedInvestment.sourceUpdateCount ===
      queryClient.getQueryState(investmentQueryKeys.today())?.dataUpdateCount
      ? submittedInvestment.quantities
      : null;
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
          onConfirmed(quantities);
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
      onConfirmed(quantities);
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

  const closeConfirmation = () => {
    if (!submissionLock.current) setIsConfirmSheetOpen(false);
  };

  return {
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
  };
}
