//하단 액션 버튼
import refreshIcon from "@/assets/icon-24px/refresh.svg";

interface InvestBottomActionProps {
  selectedTotalAmount: number;
  variant?: "purchase" | "editCancel" | "editSubmit";
  showTopShadow?: boolean;
  onReset?: () => void;
  onPurchase?: () => void;
  onEditCancel?: () => void;
  onEditSubmit?: () => void;
}

function formatCurrency(value: number) {
  return value.toLocaleString("ko-KR");
}

function InvestBottomAction({
  selectedTotalAmount,
  variant = "purchase",
  showTopShadow = true,
  onReset,
  onPurchase,
  onEditCancel,
  onEditSubmit,
}: InvestBottomActionProps) {
  const isActive = selectedTotalAmount > 0;

  const buttonText =
    variant === "editCancel"
      ? "수정 취소하기"
      : variant === "editSubmit"
        ? "수정하기"
        : isActive
          ? `구매하기 (${formatCurrency(selectedTotalAmount)}원)`
          : "구매하기";

  const handleButtonClick = () => {
    if (variant === "editCancel") {
      onEditCancel?.();
      return;
    }

    if (variant === "editSubmit") {
      if (!isActive) return;
      onEditSubmit?.();
      return;
    }

    if (!isActive) return;
    onPurchase?.();
  };

  const buttonClass =
    variant === "editCancel"
      ? "border border-[var(--color-primary-300)] bg-[var(--color-primary-100)] text-[var(--color-primary)]"
      : isActive
        ? "bg-[var(--color-primary)] text-[var(--color-neutral-0)]"
        : "bg-[var(--color-neutral-50)] text-[var(--color-neutral-400)]";

  return (
    <div
      className={[
        "fixed bottom-[80px] left-1/2 z-30 flex h-[76px] w-[390px] -translate-x-1/2 items-center gap-2 bg-[var(--color-neutral-0)] py-3 pl-5 pr-[17px]",
        showTopShadow ? "shadow-[0_-1px_6.6px_rgba(0,0,0,0.07)]" : "",
      ].join(" ")}
    >
      <button
        type="button"
        onClick={onReset}
        className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-[12px] border-[0.7px] border-[var(--color-neutral-100)] bg-[var(--color-neutral-0)]"
        aria-label="선택 초기화"
      >
        <img src={refreshIcon} alt="" className="h-6 w-6" />
      </button>

      <button
        type="button"
        onClick={handleButtonClick}
        className={[
          "h-[52px] w-[293px] shrink-0 rounded-[12px]",
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
