import { useCallback, useState } from "react";
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
}

export function useApiErrorModal({
  overridesByCode,
  onRetry,
}: UseApiErrorModalOptions = {}) {
  const navigate = useNavigate();
  const [error, setError] = useState<ApiErrorModalState | null>(null);

  const showError = useCallback(
    (err: unknown) => {
      if (err instanceof ApiError) {
        setError({
          code: err.code,
          info: getErrorMessage(err.code, overridesByCode?.[err.code]),
        });
        return;
      }

      setError({ info: DEFAULT_ERROR_MESSAGE });
    },
    [overridesByCode],
  );

  const closeError = useCallback(() => {
    setError(null);
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
      onRetry?.();
      return;
    }

    closeError();
  }, [closeError, error?.info.action, navigate, onRetry]);

  return {
    error,
    showError,
    closeError,
    handlePrimaryAction,
  };
}
