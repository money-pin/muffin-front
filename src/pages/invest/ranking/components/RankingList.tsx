import ProfitRateBadge from "@/pages/invest/components/ProfitRateBadge";
import RankingBadge from "@/pages/invest/ranking/components/RankingBadge";
import type { WeeklyRankingItem } from "@/pages/invest/ranking/types";
import {
  formatSignedCurrency,
  getProfitColorClass,
} from "@/pages/invest/utils/profitFormat";

interface RankingListProps {
  items: WeeklyRankingItem[];
  onRankingClick?: (item: WeeklyRankingItem) => void;
}

export default function RankingList({
  items,
  onRankingClick,
}: RankingListProps) {
  const listItems = items
    .filter(({ rank }) => rank >= 4 && rank <= 10)
    .sort((a, b) => a.rank - b.rank);

  return (
    <div className="bg-neutral-0 flex w-full flex-col">
      {listItems.map((item) => {
        const profitColorClass = getProfitColorClass(item.weeklyProfit);

        return (
          <button
            type="button"
            key={item.rank}
            onClick={() => onRankingClick?.(item)}
            disabled={!onRankingClick}
            className="flex w-full items-center justify-between gap-3 px-5 py-5 text-left disabled:cursor-default"
          >
            <div className="flex min-w-0 items-center gap-3">
              <RankingBadge rank={item.rank} />
              <h3 className="text-body-16-md-tighter truncate text-neutral-900">
                {item.nickname}
              </h3>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <p className={`text-body-14-bd ${profitColorClass}`}>
                {formatSignedCurrency(item.weeklyProfit)}
              </p>
              <ProfitRateBadge
                rate={item.weeklyProfitRate}
                profitAmount={item.weeklyProfit}
                size="md"
              />
            </div>
          </button>
        );
      })}
    </div>
  );
}
