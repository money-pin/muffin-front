import PodiumRankingCard from "@/pages/invest/ranking/components/PodiumRankingCard";
import type { WeeklyRankingItem } from "@/pages/invest/ranking/types";

interface RankingPodiumProps {
  items: WeeklyRankingItem[];
  onRankingClick?: (item: WeeklyRankingItem) => void;
}

const podiumOrder = [2, 1, 3] as const;

export default function RankingPodium({
  items,
  onRankingClick,
}: RankingPodiumProps) {
  return (
    <div className="grid w-full grid-cols-[1fr_1.13fr_1fr] items-start gap-3 px-5">
      {podiumOrder.map((rank) => {
        const item = items.find((ranking) => ranking.rank === rank);

        return item ? (
          <PodiumRankingCard
            key={rank}
            rank={rank}
            item={item}
            onClick={onRankingClick}
          />
        ) : (
          <div key={rank} aria-hidden="true" />
        );
      })}
    </div>
  );
}
