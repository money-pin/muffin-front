import { useEffect, useRef, useState } from "react";
import { useApiErrorModal } from "@/lib/useApiErrorModal";
import type {
  useInvestmentSectorsQuery,
  useTodayInvestmentQuery,
} from "@/pages/invest/trade/investQueries";

interface UseInvestmentQueryErrorOptions {
  todayInvestmentQuery: ReturnType<typeof useTodayInvestmentQuery>;
  investmentSectorsQuery: ReturnType<typeof useInvestmentSectorsQuery>;
  needsSectorData: boolean;
}

// 화면에 필요한 조회만 오류로 취급하고, 연속 실패 시 팝업 반복을 방지한다.
export function useInvestmentQueryError({
  todayInvestmentQuery,
  investmentSectorsQuery,
  needsSectorData,
}: UseInvestmentQueryErrorOptions) {
  const [isRetryingQuery, setIsRetryingQuery] = useState(false);
  const queryRetryLock = useRef(false);
  const notifiedErrors = useRef({ today: false, sectors: false });
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

  return {
    apiErrorState,
    closeApiError,
    handleApiErrorAction,
    isRetryingQuery,
    relevantQueryFailed,
    retryQueries,
  };
}
