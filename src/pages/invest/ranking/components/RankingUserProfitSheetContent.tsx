import ProfitRateBadge from "@/pages/invest/components/ProfitRateBadge";
import RankingBadge from "@/pages/invest/ranking/components/RankingBadge";
import type { WeeklyRankingItem } from "@/pages/invest/ranking/types";
import {
  formatCurrency,
  formatSignedCurrency,
  getProfitColorClass,
} from "@/pages/invest/utils/profitFormat";

interface RankingUserProfitSheetContentProps {
  user: WeeklyRankingItem;
}

export default function RankingUserProfitSheetContent({
  user,
}: RankingUserProfitSheetContentProps) {
  const sectors = [...(user.sectors ?? [])].sort(
    (a, b) => b.profitAmount - a.profitAmount,
  );
  const totalProfitAmount = sectors.reduce(
    (sum, sector) => sum + sector.profitAmount,
    0,
  );
  const totalInvestmentAmount = sectors.reduce(
    (sum, sector) => sum + sector.investmentAmount,
    0,
  );
  const totalProfitRate =
    totalInvestmentAmount === 0
      ? 0
      : (totalProfitAmount / totalInvestmentAmount) * 100;

  return (
    <div className="flex flex-1 flex-col overflow-y-auto px-5 pb-10">
      <section className="flex flex-col gap-5">
        <div className="flex items-center gap-1">
          <RankingBadge rank={user.rank} size="sm" variant="rank" />
          <h2 className="text-heading-18-bd text-neutral-900">
            <span className="text-primary">{user.nickname}</span>님의 수익 상세
          </h2>
        </div>

        <div className="bg-neutral-0 flex flex-col gap-2 rounded-xl border border-neutral-100 p-4">
          <div className="flex items-center justify-between">
            <span className="text-body-14-md-tighter text-neutral-600">
              총 수익
            </span>
            <div className="flex items-center gap-2">
              <strong
                className={`text-heading-18-bd ${getProfitColorClass(
                  totalProfitAmount,
                )}`}
              >
                {formatSignedCurrency(totalProfitAmount)}
              </strong>
              <ProfitRateBadge rate={totalProfitRate} size="md" />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-body-14-md-tighter text-neutral-600">
              총 투자금
            </span>
            <span className="text-body-14-md text-neutral-600">
              {formatCurrency(totalInvestmentAmount)}
            </span>
          </div>
        </div>
      </section>

      <section className="mt-8">
        <h3 className="text-body-16-bd-tighter text-neutral-900">
          섹터별 상세 내역
        </h3>

        <div className="mt-3 flex flex-col gap-2">
          {sectors.map((sector) => (
            <article
              key={sector.id}
              className="bg-neutral-0 flex h-[84px] items-center justify-between rounded-xl border border-neutral-100 p-4"
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
                  <ProfitRateBadge rate={sector.profitRate} size="md" />
                </div>
                <span className="text-body-14-md text-neutral-600">
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
