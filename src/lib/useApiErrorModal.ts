import { useCallback, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { ApiError } from "@/lib/api";
import {
  DEFAULT_ERROR_MESSAGE,
  getErrorMessage,
  type ErrorMessageInfo,
} from "@/lib/errorMessages";

interface UseApiErrorModalOptions {
  overridesByCode?: Record<string, Partial<ErrorMessageInfo>>;
  onRetry?: () => void;
}

interface ApiErrorModalState {
  code?: string;
  info: ErrorMessageInfo;
  source: unknown;
}

export function useApiErrorModal({
  overridesByCode,
  onRetry,
}: UseApiErrorModalOptions = {}) {
  const navigate = useNavigate();
  const [error, setError] = useState<ApiErrorModalState | null>(null);
  const dismissedErrorRef = useRef<unknown>(null);

  const showError = useCallback(
    (err: unknown) => {
      if (dismissedErrorRef.current === err) return;

      if (err instanceof ApiError) {
        setError({
          code: err.code,
          info: getErrorMessage(err.code, overridesByCode?.[err.code]),
          source: err,
        });
        return;
      }

      setError({ info: DEFAULT_ERROR_MESSAGE, source: err });
    },
    [overridesByCode],
  );

  const closeError = useCallback(() => {
    dismissedErrorRef.current = error?.source ?? null;
    setError(null);
  }, [error?.source]);

  const resetDismissedError = useCallback(() => {
    dismissedErrorRef.current = null;
  }, []);

  const handlePrimaryAction = useCallback(() => {
    const action = error?.info.action ?? "close";

    if (action === "login") {
      closeError();
      navigate("/login");
      return;
    }

    if (action === "onboarding") {
      closeError();
      navigate("/onboarding");
      return;
    }

    if (action === "previousOrHome") {
      closeError();
      if (window.history.length > 1) {
        navigate(-1);
      } else {
        navigate("/home");
      }
      return;
    }

    if (action === "retry") {
      resetDismissedError();
      onRetry?.();
      return;
    }

    closeError();
  }, [closeError, error?.info.action, navigate, onRetry, resetDismissedError]);

  return {
    error,
    showError,
    closeError,
    handlePrimaryAction,
    resetDismissedError,
  };
}
