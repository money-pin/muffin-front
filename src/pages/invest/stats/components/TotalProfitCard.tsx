import noteIcon from "@/assets/icon-20px/note.svg";
import chevronRightIcon from "@/assets/icon-24px/chevron-right-thin.svg";
import ProfitRateBadge from "@/pages/invest/components/ProfitRateBadge";
import type { CumulativeProfit } from "@/pages/invest/stats/types";
import {
  formatSignedCurrency,
  getProfitColorClass,
} from "@/pages/invest/utils/profitFormat";

interface TotalProfitCardProps {
  data: CumulativeProfit;
  onClick?: () => void;
}

export default function TotalProfitCard({ data, onClick }: TotalProfitCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-between rounded-2xl border border-neutral-100 bg-neutral-0 p-5 text-left"
    >
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-1">
          <img
            src={noteIcon}
            alt=""
            aria-hidden="true"
            className="h-5 w-5 object-contain"
            draggable={false}
          />
          <h2 className="text-body-16-bd-tighter leading-[1.6] text-neutral-900">
            총 누적 수익
          </h2>
        </div>

        <div className="flex items-center gap-2 pl-1">
          <span
            className={`text-heading-20-bd ${getProfitColorClass(data.amount)}`}
          >
            {formatSignedCurrency(data.amount)}
          </span>
          <ProfitRateBadge rate={data.rate} size="md" />
        </div>
      </div>

      <img
        src={chevronRightIcon}
        alt=""
        aria-hidden="true"
        className="h-6 w-6 object-contain"
        draggable={false}
      />
    </button>
  );
}
