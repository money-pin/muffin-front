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
      onClick={onClick}
      className={[
        "relative flex h-[98px] w-[80px] flex-col items-center justify-center gap-1 rounded-[12px] border-2 bg-[var(--color-neutral-0)]",
        isSelected
          ? "border-[var(--color-primary)]"
          : "border-[var(--color-neutral-0)]",
      ].join(" ")}
    >
      {showBadge && (
        <span className="text-body-14-bd absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-primary)] text-center leading-none text-[var(--color-neutral-0)]">
          {quantity}
        </span>
      )}

      <img src={isActive ? activeIcon : icon} alt="" className="h-12 w-12" />

      <span
        className={[
          "text-[length:var(--text-body-14-md-tighter)] leading-[var(--text-body-14-md-tighter--line-height)] font-[var(--text-body-14-md-tighter--font-weight)]",
          isActive
            ? "text-[var(--color-neutral-900)]"
            : "text-[var(--color-neutral-400)]",
        ].join(" ")}
      >
        {name}
      </span>
    </button>
  );
}

export default InvestAssetCard;
