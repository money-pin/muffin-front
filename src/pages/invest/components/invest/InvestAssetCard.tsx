import type { InvestAssetCardStatus } from "@/types/invest";

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
        "relative flex h-[98px] w-[80px] flex-col items-center justify-center gap-1 rounded-[12px] bg-[var(--color-neutral-0)]",
        isSelected && "border border-[var(--color-primary)] border-2",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {showBadge && (
        <span className="absolute right-2 top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--color-primary)] px-1 text-xs font-bold text-[var(--color-neutral-0)]">
          {quantity}
        </span>
      )}

      <img src={isActive ? activeIcon : icon} alt="" className="h-12 w-12" />

      <span className="text-[length:var(--text-body-14-md-tighter)] leading-[var(--text-body-14-md-tighter--line-height)] font-[var(--text-body-14-md-tighter--font-weight)] text-[var(--color-neutral-400)]">
        {name}
      </span>
    </button>
  );
}

export default InvestAssetCard;
