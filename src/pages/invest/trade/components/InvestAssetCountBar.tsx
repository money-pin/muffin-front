//투자 수량 조절 바
import minusIcon from "@/assets/icon-24px/minus.svg";
import plusIcon from "@/assets/icon-24px/plus.svg";
import plusDisabledIcon from "@/assets/icon-24px/plus-disabled.svg";

interface InvestAssetCountBarProps {
  name: string;
  totalAmount: number;
  quantity: number;
  canDecrease: boolean;
  canIncrease: boolean;
  onDecrease: () => void;
  onIncrease: () => void;
}

function formatCurrency(value: number) {
  return value.toLocaleString("ko-KR");
}

function InvestAssetCountBar({
  name,
  totalAmount,
  quantity,
  canDecrease,
  canIncrease,
  onDecrease,
  onIncrease,
}: InvestAssetCountBarProps) {
  return (
    <div className="fixed bottom-[156px] left-1/2 z-40 flex h-[64px] w-[390px] -translate-x-1/2 items-center justify-between rounded-t-[16px] bg-[var(--color-secondary-100)] px-5 py-3 shadow-[0_-4px_10px_-2px_rgba(0,0,0,0.07)]">
      <div className="flex items-baseline gap-2">
        <strong className="text-[length:var(--text-heading-18-bd)] leading-[var(--text-heading-18-bd--line-height)] font-[var(--text-heading-18-bd--font-weight)] tracking-[var(--text-heading-18-bd--letter-spacing)] text-[var(--color-neutral-1000)]">
          {name}
        </strong>

        <span className="text-[length:var(--text-body-14-md)] leading-[var(--text-body-14-md--line-height)] font-[var(--text-body-14-md--font-weight)] text-[var(--color-neutral-700)]">
          ({formatCurrency(totalAmount)}원)
        </span>
      </div>

      <div className="flex h-10 w-[131px] items-center justify-between">
        <button
          type="button"
          onClick={onDecrease}
          disabled={!canDecrease}
          className={[
            "flex h-10 w-10 items-center justify-center rounded-full",
            canDecrease
              ? "bg-[var(--color-neutral-0)]"
              : "bg-[var(--color-neutral-50)]",
          ].join(" ")}
          aria-label="수량 감소"
        >
          <img src={minusIcon} alt="" className="h-6 w-6" />
        </button>

        <span className="text-[length:var(--text-heading-18-bd)] leading-[var(--text-heading-18-bd--line-height)] font-[var(--text-heading-18-bd--font-weight)] tracking-[var(--text-heading-18-bd--letter-spacing)] text-[var(--color-neutral-1000)]">
          {quantity}
        </span>

        <button
          type="button"
          onClick={onIncrease}
          disabled={!canIncrease}
          className={[
            "flex h-10 w-10 items-center justify-center rounded-full",
            canIncrease
              ? "bg-[var(--color-neutral-0)]"
              : "bg-[var(--color-neutral-50)]",
          ].join(" ")}
          aria-label="수량 증가"
        >
          <img
            src={canIncrease ? plusIcon : plusDisabledIcon}
            alt=""
            className="h-6 w-6"
          />
        </button>
      </div>
    </div>
  );
}

export default InvestAssetCountBar;
