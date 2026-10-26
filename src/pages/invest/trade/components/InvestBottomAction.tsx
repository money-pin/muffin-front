//하단 액션 버튼
import type { FocusEventHandler, Ref } from "react";
import refreshIcon from "@/assets/icon-24px/refresh.svg";

import { formatNumber } from "@/pages/invest/utils/profitFormat";

interface InvestBottomActionProps {
  containerRef?: Ref<HTMLDivElement>;
  selectedTotalAmount: number;
  variant?: "purchase" | "editCancel" | "editSubmit" | "quantityInput";
  onBlur?: FocusEventHandler<HTMLDivElement>;
  showTopShadow?: boolean;
  disabled: boolean;
  resetDisabled?: boolean;
  onReset: () => void;
  onAction: () => void;
}

function InvestBottomAction({
  containerRef,
  selectedTotalAmount,
  variant = "purchase",
  showTopShadow = true,
  disabled,
  resetDisabled = false,
  onReset,
  onAction,
  onBlur,
}: InvestBottomActionProps) {
  const isActive = selectedTotalAmount > 0;

  const buttonText =
    variant === "quantityInput"
      ? "적용"
      : variant === "editCancel"
        ? "수정 취소하기"
        : variant === "editSubmit"
          ? "수정하기"
          : isActive
            ? `구매하기 (${formatNumber(selectedTotalAmount)}원)`
            : "구매하기";

  const buttonClass =
    variant === "editCancel"
      ? "border border-[var(--color-primary-300)] bg-[var(--color-primary-100)] text-[var(--color-primary)]"
      : !disabled
        ? "bg-[var(--color-primary)] text-[var(--color-neutral-0)]"
        : "bg-[var(--color-neutral-50)] text-[var(--color-neutral-400)]";

  return (
    <div
      ref={containerRef}
      onBlur={onBlur}
      className={[
        "fixed bottom-[80px] left-1/2 z-30 flex h-[76px] w-full max-w-[var(--max-width-app)] -translate-x-1/2 items-center gap-2 bg-[var(--color-neutral-0)] py-3 pr-[17px] pl-5",
        showTopShadow ? "shadow-[0_-1px_6.6px_rgba(0,0,0,0.07)]" : "",
      ].join(" ")}
    >
      <button
        type="button"
        onClick={onReset}
        disabled={resetDisabled}
        className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-[12px] border-[0.7px] border-[var(--color-neutral-100)] bg-[var(--color-neutral-0)] disabled:opacity-40"
        aria-label={
          variant === "quantityInput" ? "수량 입력 취소" : "선택 초기화"
        }
      >
        {variant === "quantityInput" ? (
          <span className="text-body-14-md text-neutral-600">취소</span>
        ) : (
          <img src={refreshIcon} alt="" className="h-6 w-6" />
        )}
      </button>

      <button
        type="button"
        onClick={onAction}
        disabled={disabled}
        className={[
          "h-[52px] min-w-0 flex-1 shrink-0 rounded-[12px]",
          "text-[length:var(--text-body-16-bd-tighter)] leading-[var(--text-body-16-bd-tighter--line-height)] font-[var(--text-body-16-bd-tighter--font-weight)] tracking-[var(--text-body-16-bd-tighter--letter-spacing)]",
          buttonClass,
        ].join(" ")}
      >
        {buttonText}
      </button>
    </div>
  );
}

export default InvestBottomAction;
