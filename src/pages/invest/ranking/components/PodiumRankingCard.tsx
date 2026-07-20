import muffinPlain from "@/assets/avatars/muffin-plain.png";
import bronzeCrown from "@/assets/crown/crown-bronze.svg";
import goldCrown from "@/assets/crown/crown-gold.svg";
import silverCrown from "@/assets/crown/crown-silver.svg";
import type { WeeklyRankingItem } from "@/pages/invest/ranking/types";
import { formatSignedWon } from "@/pages/invest/ranking/utils/rankingFormat";

type PodiumRank = 1 | 2 | 3;

interface PodiumRankingCardProps {
  rank: PodiumRank;
  item: WeeklyRankingItem;
  onClick?: (item: WeeklyRankingItem) => void;
}

const rankStyleMap: Record<
  PodiumRank,
  {
    wrapper: string;
    card: string;
    details: string;
    contentTop: string;
    imageTop: string;
    crownTop: string;
    crownSrc: string;
  }
> = {
  1: {
    wrapper: "pt-[32px]",
    card: "bg-positive-100",
    details: "bg-positive-50",
    contentTop: "pt-16",
    imageTop: "top-1",
    crownTop: "top-0",
    crownSrc: goldCrown,
  },
  2: {
    wrapper: "pt-[52px]",
    card: "bg-secondary-300",
    details: "bg-primary-100",
    contentTop: "pt-[68px]",
    imageTop: "top-2",
    crownTop: "top-5",
    crownSrc: silverCrown,
  },
  3: {
    wrapper: "pt-[68px]",
    card: "bg-negative-100",
    details: "bg-[#ecf6ff]",
    contentTop: "pt-[68px]",
    imageTop: "top-[9px]",
    crownTop: "top-9",
    crownSrc: bronzeCrown,
  },
};

export default function PodiumRankingCard({
  rank,
  item,
  onClick,
}: PodiumRankingCardProps) {
  const style = rankStyleMap[rank];
  const isClickable = Boolean(onClick);

  return (
    <button
      type="button"
      onClick={() => onClick?.(item)}
      disabled={!isClickable}
      className={`relative min-w-0 text-left disabled:cursor-default ${style.wrapper}`}
    >
      <div
        className={`relative flex min-w-0 flex-col overflow-hidden rounded-xl ${style.card} ${style.contentTop}`}
      >
        <img
          src={item.characterImageUrl || muffinPlain}
          alt=""
          aria-hidden="true"
          className={`absolute left-1/2 h-[73px] w-[72px] -translate-x-1/2 object-contain ${style.imageTop}`}
          draggable={false}
        />

        <div
          className={`flex min-w-0 flex-col items-center px-1 pt-4 pb-3 ${style.details}`}
        >
          <h3 className="text-body-16-md-tighter w-full truncate text-center text-neutral-900">
            {item.nickname}
          </h3>
          <div className="text-positive mt-1 flex flex-col items-center">
            <p className="text-caption-12-bd">
              {formatSignedWon(item.weeklyProfit)}
            </p>
            <p className="text-caption-12-bd flex items-center gap-1">
              <span aria-hidden="true" className="text-[8px] leading-none">
                ▲
              </span>
              <span>{Math.abs(item.weeklyProfitRate).toFixed(1)}%</span>
            </p>
          </div>
        </div>
      </div>

      <div
        className={`absolute left-1/2 z-10 size-[42px] -translate-x-1/2 ${style.crownTop}`}
      >
        <img
          src={style.crownSrc}
          alt={`${rank}위`}
          className="size-full"
          draggable={false}
        />
      </div>
    </button>
  );
}
