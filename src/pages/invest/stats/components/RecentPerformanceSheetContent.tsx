import calendarIcon from "@/assets/icon-20px/calendar.svg";
import Badge from "@/components/common/Badge";
import ProfitRateBadge from "@/pages/invest/components/ProfitRateBadge";
import type {
  RecentPerformanceSummary,
  SectorPerformanceDetail,
} from "@/pages/invest/stats/types";

interface RecentPerformanceSheetContentProps {
  summary: RecentPerformanceSummary;
  sectors: SectorPerformanceDetail[];
}

function formatCurrency(value: number) {
  return `${Math.abs(value).toLocaleString()}원`;
}

function getSignedCurrency(value: number) {
  const sign = value > 0 ? "+" : value < 0 ? "-" : "";
  return `${sign}${formatCurrency(value)}`;
}

function getProfitColorClass(value: number) {
  if (value > 0) return "text-positive";
  if (value < 0) return "text-negative";
  return "text-neutral-600";
}

export default function RecentPerformanceSheetContent({
  summary,
  sectors,
}: RecentPerformanceSheetContentProps) {
  return (
    <div className="flex max-h-[calc(100dvh-52px)] flex-col overflow-y-auto px-5 pb-8 pt-8">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <img
            src={calendarIcon}
            alt=""
            aria-hidden="true"
            className="h-5 w-5 object-contain"
            draggable={false}
          />
          <h2 className="text-body-16-bd-tighter leading-[1.6] text-neutral-900">
            최근 투자 성과
          </h2>
        </div>
        <Badge variant="gray" size="sm">
          {summary.date.month}월 {summary.date.day}일
        </Badge>
      </div>

      <section className="mt-5 flex flex-col gap-2 rounded-2xl border border-neutral-100 bg-neutral-0 p-4">
        <div className="flex items-center justify-between">
          <span className="text-body-16-md-tighter leading-[1.6] text-neutral-600">
            총 수익
          </span>
          <div className="flex items-center gap-2">
            <strong
              className={`text-heading-20-bd ${getProfitColorClass(
                summary.profitAmount,
              )}`}
            >
              {getSignedCurrency(summary.profitAmount)}
            </strong>
            <ProfitRateBadge rate={summary.profitRate} size="md" />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-body-16-md-tighter leading-[1.6] text-neutral-600">
            총 투자금
          </span>
          <span className="text-body-16-md-tighter leading-[1.6] text-neutral-600">
            {formatCurrency(summary.investmentAmount)}
          </span>
        </div>
      </section>

      <section className="mt-9">
        <h3 className="text-body-16-bd-tighter leading-[1.6] text-neutral-900">
          섹터별 상세 내역
        </h3>

        <div className="mt-4 flex flex-col gap-2">
          {sectors.map((sector) => (
            <article
              key={sector.id}
              className="flex h-[84px] items-center justify-between rounded-2xl border border-neutral-100 bg-neutral-0 px-4"
            >
              <div className="flex items-center gap-3">
                <img
                  src={sector.iconSrc}
                  alt=""
                  aria-hidden="true"
                  className="h-10 w-10 object-contain"
                  draggable={false}
                />
                <strong className="text-body-16-bd-tighter leading-[1.6] text-neutral-900">
                  {sector.name}
                </strong>
              </div>

              <div className="flex flex-col items-end gap-1">
                <div className="flex items-center gap-2">
                  <strong
                    className={`text-body-16-bd-tighter leading-[1.6] ${getProfitColorClass(
                      sector.profitAmount,
                    )}`}
                  >
                    {getSignedCurrency(sector.profitAmount)}
                  </strong>
                  <ProfitRateBadge rate={sector.profitRate} size="md" />
                </div>
                <span className="text-body-14-md-tighter text-neutral-600">
                  투자금: {formatCurrency(sector.investmentAmount)}
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
