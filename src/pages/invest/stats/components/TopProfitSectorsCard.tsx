import rankingIcon from "@/assets/icon-20px/ranking.svg";
import ProfitRateBadge from "@/pages/invest/components/ProfitRateBadge";
import RankBadge from "@/pages/invest/stats/components/RankBadge";
import type { TopSector } from "@/pages/invest/stats/types";
import {
  formatSignedCurrency,
  getProfitColorClass,
} from "@/pages/invest/utils/profitFormat";

interface TopProfitSectorsCardProps {
  sectors: TopSector[];
}

const EMPTY_TOP_SECTORS: TopSector[] = [
  { rank: 1, name: "---", profitAmount: 0, profitRate: 0 },
  { rank: 2, name: "---", profitAmount: 0, profitRate: 0 },
  { rank: 3, name: "---", profitAmount: 0, profitRate: 0 },
];

export default function TopProfitSectorsCard({
  sectors,
}: TopProfitSectorsCardProps) {
  const displaySectors = sectors.length > 0 ? sectors : EMPTY_TOP_SECTORS;

  return (
    <div className="bg-neutral-0 flex w-full flex-col gap-3 rounded-2xl border border-neutral-100 px-5 pt-5 pb-4">
      <div className="flex w-full items-center gap-1 px-1">
        <img
          src={rankingIcon}
          alt=""
          aria-hidden="true"
          className="h-5 w-5 object-contain"
          draggable={false}
        />
        <h2 className="text-body-16-bd-tighter leading-[1.6] text-neutral-900">
          수익 TOP 3 섹터
        </h2>
      </div>

      <div className="flex flex-col">
        {displaySectors.map((sector, index) => (
          <div key={sector.rank} className="flex flex-col">
            <div className="flex w-full items-center justify-between px-1 py-3">
              <div className="flex items-center gap-3">
                <RankBadge rank={sector.rank} />
                <span className="text-body-16-md-tighter leading-[1.6] text-neutral-900">
                  {sector.name}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`text-body-16-bd-tighter leading-[1.6] ${getProfitColorClass(
                    sector.profitAmount,
                  )}`}
                >
                  {formatSignedCurrency(sector.profitAmount)}
                </span>
                <ProfitRateBadge rate={sector.profitRate} size="md" />
              </div>
            </div>
            {index < displaySectors.length - 1 && (
              <div className="w-full border-t border-neutral-100" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
