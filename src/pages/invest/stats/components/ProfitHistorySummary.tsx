import ProfitRateBadge from "@/pages/invest/components/ProfitRateBadge";
import type {
  ProfitHistoryPeriod,
  ProfitHistorySummary as ProfitHistorySummaryType,
} from "@/pages/invest/stats/types";

interface ProfitHistorySummaryProps {
  period: ProfitHistoryPeriod;
  data: ProfitHistorySummaryType;
}

function formatCurrency(value: number) {
  return `${Math.abs(value).toLocaleString("ko-KR")}원`;
}

function getSignedCurrency(value: number) {
  if (value > 0) return `+${formatCurrency(value)}`;
  if (value < 0) return `-${formatCurrency(value)}`;

  return formatCurrency(value);
}

function getProfitColorClass(value: number) {
  if (value > 0) return "text-positive";
  if (value < 0) return "text-negative";

  return "text-neutral-600";
}

export default function ProfitHistorySummary({
  period,
  data,
}: ProfitHistorySummaryProps) {
  const showPeriodControls = period !== "all";

  return (
    <section className="flex flex-col gap-5 bg-neutral-0 px-5 py-6">
      <div className="flex items-center gap-2">
        {showPeriodControls && (
          <button
            type="button"
            aria-label="이전 기간"
            className="flex size-3 items-center justify-center text-neutral-900"
          >
            <span aria-hidden="true" className="text-[10px] leading-none">
              ◀
            </span>
          </button>
        )}

        <h2 className="text-body-16-bd-tighter text-neutral-900">
          {data.title}
        </h2>

        {showPeriodControls && (
          <button
            type="button"
            aria-label="다음 기간"
            className="flex size-3 items-center justify-center text-neutral-200"
          >
            <span aria-hidden="true" className="text-[10px] leading-none">
              ▶
            </span>
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
              {getSignedCurrency(data.profitAmount)}
            </p>
            <ProfitRateBadge rate={data.profitRate} size="md" className="h-6" />
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
