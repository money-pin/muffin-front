import { useEffect } from "react";
import toastCheckIcon from "@/assets/icon-16px/toast-check-white.svg";

const DEFAULT_DURATION = 3000;

interface ToastProps {
  message: string;
  onClose: () => void;
  // 우측 액션(예: "취소"). 지정하면 라벨 버튼이 뜨고, 누르면 onAction 실행 후 닫힌다.
  actionLabel?: string;
  onAction?: () => void;
  duration?: number;
}

export default function Toast({
  message,
  onClose,
  actionLabel,
  onAction,
  duration = DEFAULT_DURATION,
}: ToastProps) {
  // 마운트 시 한 번만 타이머를 건다. 새 토스트는 부모가 key를 바꿔 재마운트시킨다.
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleActionClick = () => {
    onAction?.();
    onClose();
  };

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-6 z-[60] mx-auto w-full max-w-[var(--max-width-app)] px-5"
      role="status"
      aria-live="polite"
    >
      <div className="pointer-events-auto flex w-full items-center justify-between gap-2 rounded-[12px] bg-neutral-700 px-4 py-3">
        <div className="flex min-w-0 items-center gap-2">
          <img
            src={toastCheckIcon}
            alt=""
            aria-hidden="true"
            className="size-4 shrink-0 object-contain"
            draggable={false}
          />
          {/* 피그마 Body/16_rg_tighter_150 기준 line-height 150%.
              프로젝트 토큰은 160%라 여기서만 1.5로 덮어 높이 48px을 맞춘다. */}
          <p className="text-body-16-rg-tighter text-neutral-0 truncate leading-[1.5]">
            {message}
          </p>
        </div>

        {actionLabel && (
          <button
            type="button"
            onClick={handleActionClick}
            className="text-body-16-md-tighter text-neutral-0 shrink-0"
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}
