import calendarIcon from "@/assets/icon-20px/calendar.svg";
import Badge from "@/components/common/Badge";
import ProfitRateBadge from "@/pages/invest/components/ProfitRateBadge";
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
  return (
    <div className="flex flex-col px-5 pt-8 pb-8">
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
        {summary && (
          <Badge variant="gray" size="sm">
            {summary.date.month}월 {summary.date.day}일
          </Badge>
        )}
      </div>

      {isLoading && (
        <p className="text-body-14-md mt-8 text-center text-neutral-500">
          최근 투자 성과를 불러오는 중입니다.
        </p>
      )}

      {isError && !isLoading && (
        <p className="text-body-14-md mt-8 text-center text-neutral-500">
          최근 투자 성과를 불러오지 못했습니다.
        </p>
      )}

      {!summary && !isLoading && !isError && (
        <p className="text-body-14-md mt-8 text-center text-neutral-500">
          최근 정산 완료된 투자 성과가 없습니다.
        </p>
      )}

      {summary && !isLoading && !isError && (
        <>
          <section className="bg-neutral-0 mt-5 flex flex-col gap-2 rounded-2xl border border-neutral-100 p-4">
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
                  {formatSignedCurrency(summary.profitAmount)}
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

            {sectors.length === 0 ? (
              <p className="bg-neutral-0 text-body-14-md mt-4 rounded-2xl border border-neutral-100 px-4 py-6 text-center text-neutral-500">
                투자한 섹터 내역이 없습니다.
              </p>
            ) : (
              <div className="mt-4 flex flex-col gap-2">
                {sectors.map((sector) => (
                  <article
                    key={sector.id}
                    className="bg-neutral-0 flex h-[84px] items-center justify-between rounded-2xl border border-neutral-100 px-4"
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
                          {formatSignedCurrency(sector.profitAmount)}
                        </strong>
                        <ProfitRateBadge rate={sector.profitRate} size="md" />
                      </div>
                      <span className="text-body-14-md-tighter text-neutral-600">
                        투자금 {formatCurrency(sector.investmentAmount)}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
