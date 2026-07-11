import refreshIcon from "@/assets/icon-24px/refresh.svg";

interface InvestBottomActionProps {
  selectedTotalAmount: number;
  onReset?: () => void;
  onPurchase?: () => void;
}

function formatCurrency(value: number) {
  return value.toLocaleString("ko-KR");
}

function InvestBottomAction({
  selectedTotalAmount,
  onReset,
  onPurchase,
}: InvestBottomActionProps) {
  const isActive = selectedTotalAmount > 0;

  const buttonText = isActive
    ? `구매하기 (${formatCurrency(selectedTotalAmount)}원)`
    : "구매하기";

  return (
    <div className="fixed bottom-[80px] left-1/2 z-30 flex h-[76px] w-full max-w-[390px] -translate-x-1/2 items-center gap-2 bg-[var(--color-neutral-0)] py-3 pl-5 pr-[17px]">
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
        onClick={onPurchase}
        disabled={!isActive}
        className={[
          "h-[52px] w-[293px] shrink-0 rounded-[12px]",
          "text-[length:var(--text-body-16-bd-tighter)] leading-[var(--text-body-16-bd-tighter--line-height)] font-[var(--text-body-16-bd-tighter--font-weight)] tracking-[var(--text-body-16-bd-tighter--letter-spacing)]",
          isActive
            ? "bg-[var(--color-primary)] text-white"
            : "bg-[var(--color-neutral-50)] text-[var(--color-neutral-400)]",
        ].join(" ")}
      >
        {buttonText}
      </button>
    </div>
  );
}

export default InvestBottomAction;
