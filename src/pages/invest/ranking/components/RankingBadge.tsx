interface RankingBadgeProps {
  rank: number;
  showSuffix?: boolean;
  size?: "sm" | "md";
  variant?: "gray" | "rank";
}

export default function RankingBadge({
  rank,
  showSuffix = false,
  size = "md",
  variant = "gray",
}: RankingBadgeProps) {
  const label = `${rank.toLocaleString("ko-KR")}${showSuffix ? "위" : ""}`;
  const sizeClass = size === "sm" ? "h-6 min-w-6 px-1.5" : "h-8 min-w-8 px-2";
  const variantClass = getRankingBadgeVariantClass(rank, variant);

  return (
    <span
      className={`text-body-16-bd-tighter flex shrink-0 items-center justify-center rounded-lg leading-none select-none ${sizeClass} ${variantClass}`}
    >
      {label}
    </span>
  );
}

function getRankingBadgeVariantClass(
  rank: number,
  variant: NonNullable<RankingBadgeProps["variant"]>,
) {
  if (variant === "gray") return "bg-neutral-50 text-neutral-600";

  if (rank === 1) return "bg-gold text-primary-900";
  if (rank === 2) return "bg-silver text-neutral-0";
  if (rank === 3) return "bg-bronze text-neutral-0";

  return "bg-neutral-50 text-neutral-600";
}
