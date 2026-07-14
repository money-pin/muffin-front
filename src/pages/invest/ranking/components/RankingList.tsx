import ProfitRateBadge from "@/pages/invest/components/ProfitRateBadge";
import RankingBadge from "@/pages/invest/ranking/components/RankingBadge";
import type { WeeklyRankingItem } from "@/pages/invest/ranking/types";
import { formatSignedWon } from "@/pages/invest/ranking/utils/rankingFormat";

interface RankingListProps {
  items: WeeklyRankingItem[];
}

export default function RankingList({ items }: RankingListProps) {
  const listItems = items
    .filter(({ rank }) => rank >= 4 && rank <= 10)
    .sort((a, b) => a.rank - b.rank);

  return (
    <div className="flex w-full flex-col bg-neutral-0">
      {listItems.map((item) => (
        <article
          key={item.rank}
          className="flex w-full items-center justify-between gap-3 px-5 py-5"
        >
          <div className="flex min-w-0 items-center gap-3">
            <RankingBadge rank={item.rank} />
            <h3 className="truncate text-body-16-md-tighter text-neutral-900">
              {item.nickname}
            </h3>
          </div>

          <div className="flex shrink-0 items-center gap-2 text-positive">
            <p className="text-body-14-bd">
              {formatSignedWon(item.weeklyProfit)}
            </p>
            <ProfitRateBadge rate={item.weeklyProfitRate} size="md" />
          </div>
        </article>
      ))}
    </div>
  );
}
