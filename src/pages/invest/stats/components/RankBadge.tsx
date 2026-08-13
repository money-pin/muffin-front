interface RankBadgeProps {
  rank: 1 | 2 | 3;
}

const rankClassMap: Record<RankBadgeProps["rank"], string> = {
  1: "bg-gold text-[#331900]",
  2: "bg-silver text-neutral-0",
  3: "bg-bronze text-neutral-0",
};

export default function RankBadge({ rank }: RankBadgeProps) {
  return (
    <span
      className={`flex h-8 w-8 items-center justify-center rounded-lg text-[16px] leading-none font-bold select-none ${rankClassMap[rank]}`}
    >
      {rank}
    </span>
  );
}
