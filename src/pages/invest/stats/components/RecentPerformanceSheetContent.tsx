import calendarIcon from "@/assets/icon-20px/calendar.svg";
import Badge from "@/components/common/Badge";
import ProfitRateBadge from "@/pages/invest/components/ProfitRateBadge";
import RecentPerformanceSheetSkeleton from "@/pages/invest/stats/components/RecentPerformanceSheetSkeleton";
import type {
  RecentPerformanceSummary,
  SectorPerformanceDetail,
} from "@/pages/invest/stats/types";
import {
  formatCurrency,
  formatSignedCurrency,
  getProfitColorClass,
} from "@/pages/invest/utils/profitFormat";

interface RecentPerformanceSheetContentProps {
  summary?: RecentPerformanceSummary;
  sectors: SectorPerformanceDetail[];
  isLoading?: boolean;
  isError?: boolean;
}

export default function RecentPerformanceSheetContent({
  summary,
  sectors,
  isLoading = false,
  isError = false,
}: RecentPerformanceSheetContentProps) {
  if (isLoading) {
    return <RecentPerformanceSheetSkeleton />;
  }

  return (
    <div className="flex flex-col gap-8 px-5 pb-10">
      <section className="flex flex-col gap-5">
        <div className="flex items-center gap-2 px-1">
          <div className="flex items-center gap-1">
            <img
              src={calendarIcon}
              alt=""
              aria-hidden="true"
              className="h-5 w-5 object-contain"
              draggable={false}
            />
            <h2 className="text-body-16-bd-tighter text-neutral-900">
              최근 투자 성과
            </h2>
          </div>
          {summary && (
            <Badge variant="gray" size="sm">
              {summary.date.month}월 {summary.date.day}일
            </Badge>
          )}
        </div>

        {isError && (
          <p className="bg-neutral-0 text-body-14-md rounded-xl border border-neutral-100 px-4 py-6 text-center text-neutral-600">
            최근 투자 성과를 불러오지 못했습니다.
          </p>
        )}

        {!summary && !isError && (
          <p className="bg-neutral-0 text-body-14-md rounded-xl border border-neutral-100 px-4 py-6 text-center text-neutral-600">
            최근 정산 완료된 투자 성과가 없습니다.
          </p>
        )}

        {summary && !isError && (
          <section className="bg-neutral-0 flex flex-col gap-2 rounded-xl border border-neutral-100 p-4">
            <div className="flex items-center justify-between gap-3">
              <span className="text-body-14-md text-neutral-600">총 수익</span>
              <div className="flex min-w-0 items-center gap-2">
                <strong
                  className={`text-heading-18-bd truncate ${getProfitColorClass(
                    summary.profitAmount,
                  )}`}
                >
                  {formatSignedCurrency(summary.profitAmount)}
                </strong>
                <ProfitRateBadge
                  rate={summary.profitRate}
                  profitAmount={summary.profitAmount}
                  size="md"
                />
              </div>
            </div>

            <div className="flex items-center justify-between gap-3">
              <span className="text-body-14-md text-neutral-600">
                총 투자금
              </span>
              <span className="text-body-14-md text-neutral-600">
                {formatCurrency(summary.investmentAmount)}
              </span>
            </div>
          </section>
        )}
      </section>

      {summary && !isError && sectors.length > 0 && (
        <section className="flex flex-col gap-3">
          <h3 className="text-body-16-bd-tighter text-neutral-900">
            섹터별 상세 내역
          </h3>

          <div className="flex flex-col gap-2">
            {sectors.map((sector) => (
              <article
                key={sector.id}
                className="bg-neutral-0 flex min-h-[84px] items-center justify-between gap-3 rounded-xl border border-neutral-100 p-4"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <img
                    src={sector.iconSrc}
                    alt=""
                    aria-hidden="true"
                    className="h-10 w-10 shrink-0 object-contain"
                    draggable={false}
                  />
                  <strong className="text-body-16-bd-tighter truncate text-neutral-900">
                    {sector.name}
                  </strong>
                </div>

                <div className="flex shrink-0 flex-col items-end gap-1">
                  <div className="flex items-center gap-2">
                    <strong
                      className={`text-body-16-bd-tighter ${getProfitColorClass(
                        sector.profitAmount,
                      )}`}
                    >
                      {formatSignedCurrency(sector.profitAmount)}
                    </strong>
                    <ProfitRateBadge
                      rate={sector.profitRate}
                      profitAmount={sector.profitAmount}
                      size="md"
                    />
                  </div>
                  <span className="text-body-14-md text-neutral-600">
                    투자금: {formatCurrency(sector.investmentAmount)}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
