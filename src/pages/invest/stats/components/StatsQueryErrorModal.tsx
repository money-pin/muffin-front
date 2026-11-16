import { useRef, useState } from "react";
import ErrorModal from "@/components/common/ErrorModal";
import { ApiError } from "@/lib/api";
import { DEFAULT_ERROR_MESSAGE } from "@/lib/errorMessages";

interface StatsQueryErrorModalProps {
  error: unknown;
  errorUpdatedAt: number;
  isError: boolean;
  isFetching: boolean;
  hasData: boolean;
  enabled?: boolean;
  onRetry: () => Promise<unknown>;
  onExit?: () => void;
}

// 최초 메인은 재시도만, 상세 최초 실패는 나가기, 재조회 실패는 기존 화면 유지.
export default function StatsQueryErrorModal({
  error,
  errorUpdatedAt,
  isError,
  isFetching,
  hasData,
  enabled = true,
  onRetry,
  onExit,
}: StatsQueryErrorModalProps) {
  const [dismissedAt, setDismissedAt] = useState<number | null>(null);
  const retryingRef = useRef(false);
  const canClose = hasData || !!onExit;
  const isAuthError =
    error instanceof ApiError && /(^401$|AUTH_401_)/.test(error.code);
  const close = () => {
    if (!canClose) return;
    setDismissedAt(errorUpdatedAt);
    if (!hasData) onExit?.();
  };
  const retry = async () => {
    // React가 버튼의 disabled를 반영하기 전 연속 클릭도 차단한다.
    if (isFetching || retryingRef.current) return;
    retryingRef.current = true;
    try {
      await onRetry();
    } finally {
      retryingRef.current = false;
    }
  };

  return (
    <div
      onKeyDown={(event) => {
        if (event.key !== "Escape") return;
        event.stopPropagation();
        event.preventDefault();
        close();
      }}
    >
      <ErrorModal
        layerClassName="z-[60]"
        autoFocusPrimaryAction
        isOpen={
          enabled && isError && !isAuthError && dismissedAt !== errorUpdatedAt
        }
        info={{
          ...DEFAULT_ERROR_MESSAGE,
          secondaryLabel: canClose ? "닫기" : undefined,
        }}
        onPrimaryAction={() => void retry()}
        onSecondaryAction={close}
        onClose={close}
        isLoading={isFetching}
      />
    </div>
  );
}
