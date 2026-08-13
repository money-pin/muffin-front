import polygonIcon from "@/assets/investment/investment-polygon.svg";
import ProfitRateBadge from "@/pages/invest/components/ProfitRateBadge";
import type {
  ProfitHistoryPeriod,
  ProfitHistorySummary as ProfitHistorySummaryType,
} from "@/pages/invest/stats/types";
import {
  formatCurrency,
  formatSignedCurrency,
  getProfitColorClass,
} from "@/pages/invest/utils/profitFormat";

interface ProfitHistorySummaryProps {
  period: ProfitHistoryPeriod;
  data: ProfitHistorySummaryType;
  hasPrev?: boolean;
  hasNext?: boolean;
  onPrev?: () => void;
  onNext?: () => void;
}

export default function ProfitHistorySummary({
  period,
  data,
  hasPrev = false,
  hasNext = false,
  onPrev,
  onNext,
}: ProfitHistorySummaryProps) {
  const showPeriodControls = period !== "all";

  return (
    <section className="bg-neutral-0 flex flex-col gap-5 px-5 py-6">
      <div className="flex items-center gap-2">
        {showPeriodControls && (
          <button
            type="button"
            aria-label="이전 기간"
            disabled={!hasPrev}
            className="flex size-3 items-center justify-center disabled:opacity-20"
            onClick={onPrev}
          >
            <img
              src={polygonIcon}
              alt=""
              aria-hidden="true"
              className="h-[9px] w-2"
              draggable={false}
            />
          </button>
        )}

        <h2 className="text-body-16-bd-tighter text-neutral-900">
          {data.title}
        </h2>

        {showPeriodControls && (
          <button
            type="button"
            aria-label="다음 기간"
            disabled={!hasNext}
            className="flex size-3 items-center justify-center disabled:opacity-20"
            onClick={onNext}
          >
            <img
              src={polygonIcon}
              alt=""
              aria-hidden="true"
              className="h-[9px] w-2 rotate-180"
              draggable={false}
            />
          </button>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <p className="text-body-16-md text-neutral-600">총 수익</p>
          <div className="flex items-center gap-2.5">
            <p
              className={`text-heading-20-bd ${getProfitColorClass(
                data.profitAmount,
              )}`}
            >
              {formatSignedCurrency(data.profitAmount)}
            </p>
            <ProfitRateBadge
              rate={data.profitRate}
              profitAmount={data.profitAmount}
              size="md"
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-body-16-md text-neutral-600">총 투자금</p>
          <p className="text-body-16-md text-neutral-600">
            {formatCurrency(data.investmentAmount)}
          </p>
        </div>
      </div>
    </section>
  );
}
