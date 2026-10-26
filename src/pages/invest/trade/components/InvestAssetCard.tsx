//투자 항목 카드
import type { InvestAssetCardStatus } from "@/pages/invest/trade/types/invest";

interface InvestAssetCardProps {
  name: string;
  icon: string;
  activeIcon: string;
  status?: InvestAssetCardStatus;
  quantity?: number;
  onClick?: () => void;
}

function InvestAssetCard({
  name,
  icon,
  activeIcon,
  status = "default",
  quantity = 0,
  onClick,
}: InvestAssetCardProps) {
  const isActive = status === "selected" || status === "purchased";
  const isSelected = status === "selected";
  const showBadge = isActive && quantity > 0;

  return (
    <button
      type="button"
      aria-pressed={isSelected}
      onClick={onClick}
      className={[
        "bg-neutral-0 relative flex h-[98px] w-full min-w-0 flex-col items-center justify-center gap-1 rounded-xl border-2 transition-colors duration-300 ease-[ease-out] motion-reduce:transition-none",
        isSelected
          ? "border-[var(--color-primary)]"
          : "border-[var(--color-neutral-0)]",
      ].join(" ")}
    >
      {showBadge && (
        <span className="text-body-14-bd bg-primary text-neutral-0 absolute top-[6px] right-[6px] flex size-6 shrink-0 items-center justify-center rounded-full text-center leading-none">
          {quantity}
        </span>
      )}

      <img
        src={isActive ? activeIcon : icon}
        alt=""
        className="size-12 shrink-0 object-contain"
      />

      <span
        className={[
          "text-body-14-md-tighter max-w-full truncate px-1 transition-colors duration-300 ease-[ease-out] motion-reduce:transition-none",
          isActive ? "text-neutral-900" : "text-neutral-600",
        ].join(" ")}
      >
        {name}
      </span>
    </button>
  );
}

export default InvestAssetCard;
