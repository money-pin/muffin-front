interface RankBadgeProps {
  rank: 1 | 2 | 3;
}

const rankClassMap: Record<RankBadgeProps["rank"], string> = {
  1: "bg-[#FFD400] text-[#331900]",
  2: "bg-[#BABABA] text-neutral-0",
  3: "bg-[#DE7813] text-neutral-0",
};

export default function RankBadge({ rank }: RankBadgeProps) {
  return (
    <span
      className={`flex h-8 w-8 select-none items-center justify-center rounded-lg text-[16px] font-bold leading-none ${rankClassMap[rank]}`}
    >
      {rank}
    </span>
  );
}
