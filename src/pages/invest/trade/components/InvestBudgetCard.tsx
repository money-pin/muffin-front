import { formatNumber } from "@/pages/invest/utils/profitFormat";

interface InvestBudgetCardProps {
  totalBudget: number;
  remainingBudget: number;
}

function InvestBudgetCard({
  totalBudget,
  remainingBudget,
}: InvestBudgetCardProps) {
  const progressPercent =
    totalBudget > 0 &&
    Number.isFinite(totalBudget) &&
    Number.isFinite(remainingBudget)
      ? Math.max(0, Math.min(100, (remainingBudget / totalBudget) * 100))
      : 0;

  return (
    <section aria-label="남은 투자 예산" className="flex w-full flex-col gap-2">
      <div
        role="progressbar"
        aria-label="남은 투자 예산 비율"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progressPercent}
        className="bg-neutral-0 h-2 w-full overflow-hidden rounded-full"
      >
        <div
          className="bg-primary h-full rounded-full transition-[width] duration-300 ease-[cubic-bezier(0.2,0,0,1)] motion-reduce:transition-none"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
        <h2 className="text-caption-12-md shrink-0 text-neutral-600">
          남은 투자 예산
        </h2>
        <div className="ml-auto flex flex-wrap items-center justify-end gap-x-2 gap-y-1">
          <span className="text-caption-12-md shrink-0 whitespace-nowrap text-neutral-400">
            {formatNumber(totalBudget)}원 중
          </span>
          <strong className="text-heading-20-md shrink-0 whitespace-nowrap text-neutral-900">
            {formatNumber(remainingBudget)}원
          </strong>
        </div>
      </div>
    </section>
  );
}

export default InvestBudgetCard;
