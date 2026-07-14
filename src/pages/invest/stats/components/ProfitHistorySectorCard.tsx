import ProfitRateBadge from "@/pages/invest/components/ProfitRateBadge";
import type { ProfitHistorySector } from "@/pages/invest/stats/types";
import {
  formatCurrency,
  formatSignedCurrency,
  getProfitColorClass,
} from "@/pages/invest/utils/profitFormat";

interface ProfitHistorySectorCardProps {
  sector: ProfitHistorySector;
}

export default function ProfitHistorySectorCard({
  sector,
}: ProfitHistorySectorCardProps) {
  return (
    <article className="flex items-center gap-3 rounded-xl border border-neutral-100 bg-neutral-0 p-4">
      <img
        src={sector.iconSrc}
        alt=""
        aria-hidden="true"
        className="size-10 shrink-0"
        draggable={false}
      />

      <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
        <h3 className="truncate text-body-16-bd-tighter text-neutral-900">
          {sector.name}
        </h3>

        <div className="flex shrink-0 flex-col items-end gap-1">
          <div className="flex items-center gap-2">
            <p
              className={`text-body-16-bd-tighter ${getProfitColorClass(
                sector.profitAmount,
              )}`}
            >
              {formatSignedCurrency(sector.profitAmount)}
            </p>
            <ProfitRateBadge rate={sector.profitRate} />
          </div>
          <p className="text-body-14-md text-neutral-600">
            총 투자금: {formatCurrency(sector.investmentAmount)}
          </p>
        </div>
      </div>
    </article>
  );
}
