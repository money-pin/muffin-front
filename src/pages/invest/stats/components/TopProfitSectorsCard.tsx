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
  variant?: "card" | "section";
}

const EMPTY_TOP_SECTORS: TopSector[] = [
  { rank: 1, name: "---", profitAmount: 0, profitRate: 0 },
  { rank: 2, name: "---", profitAmount: 0, profitRate: 0 },
  { rank: 3, name: "---", profitAmount: 0, profitRate: 0 },
];

function fillTopSectors(sectors: TopSector[]) {
  return EMPTY_TOP_SECTORS.map((emptySector) => {
    return (
      sectors.find((sector) => sector.rank === emptySector.rank) ?? emptySector
    );
  });
}

export default function TopProfitSectorsCard({
  sectors,
  variant = "card",
}: TopProfitSectorsCardProps) {
  const displaySectors = fillTopSectors(sectors);
  const isSection = variant === "section";

  const header = (
    <div className="flex w-full items-center gap-1 px-1">
      <img
        src={rankingIcon}
        alt=""
        aria-hidden="true"
        className="h-5 w-5 shrink-0 object-contain"
        draggable={false}
      />
      <h2 className="text-body-16-bd-tighter leading-[1.6] text-neutral-900">
        수익 TOP 3 섹터
      </h2>
    </div>
  );

  const sectorList = (
    <div className="flex flex-col">
      {displaySectors.map((sector, index) => {
        const isPlaceholder = sector.name === "---";

        return (
          <div
            key={sector.rank}
            className={`flex flex-col ${
              isSection && index < displaySectors.length - 1 ? "gap-1 pb-1" : ""
            }`}
          >
            <div
              className={`flex w-full items-center justify-between py-3 ${
                isSection ? "h-14 px-2" : "px-1"
              }`}
            >
              <div className="flex min-w-0 items-center gap-3">
                <RankBadge rank={sector.rank} />
                <span className="text-body-16-md-tighter truncate leading-[1.6] text-neutral-900">
                  {sector.name}
                </span>
              </div>

              {!isPlaceholder && (
                <div className="flex shrink-0 items-center gap-2">
                  <span
                    className={`text-body-16-bd-tighter leading-[1.6] ${getProfitColorClass(
                      sector.profitAmount,
                    )}`}
                  >
                    {formatSignedCurrency(sector.profitAmount)}
                  </span>
                  <ProfitRateBadge
                    rate={sector.profitRate}
                    profitAmount={sector.profitAmount}
                    size="md"
                  />
                </div>
              )}
            </div>
            {index < displaySectors.length - 1 && (
              <div
                className={`border-t border-neutral-100 ${
                  isSection ? "mx-[18px]" : "w-full"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );

  if (isSection) {
    return (
      <div className="flex w-full flex-col gap-2">
        {header}
        <div className="bg-neutral-0 rounded-2xl border border-neutral-100 px-3 py-2">
          {sectorList}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-neutral-0 flex w-full flex-col gap-3 rounded-2xl border border-neutral-100 px-5 pt-5 pb-4">
      {header}
      {sectorList}
    </div>
  );
}
