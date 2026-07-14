interface RankingBadgeProps {
  rank: number;
  showSuffix?: boolean;
}

export default function RankingBadge({
  rank,
  showSuffix = false,
}: RankingBadgeProps) {
  const label = `${rank.toLocaleString("ko-KR")}${showSuffix ? "위" : ""}`;

  return (
    <span className="flex h-8 min-w-8 shrink-0 select-none items-center justify-center rounded-lg bg-neutral-50 px-2 text-body-16-bd-tighter leading-none text-neutral-600">
      {label}
    </span>
  );
}
