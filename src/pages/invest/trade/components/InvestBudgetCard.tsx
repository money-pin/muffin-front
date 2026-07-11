import walletIcon from "@/assets/icon-20px/wallet.svg";

interface InvestBudgetCardProps {
  totalBudget: number;
  remainingBudget: number;
}

function formatCurrency(value: number) {
  return value.toLocaleString("ko-KR");
}

function InvestBudgetCard({
  totalBudget,
  remainingBudget,
}: InvestBudgetCardProps) {
  const progressPercent = Math.max(
    0,
    Math.min(100, (remainingBudget / totalBudget) * 100),
  );

  return (
    <section className="flex h-[128px] w-full flex-col rounded-[16px] border border-[var(--color-neutral-100)] bg-[var(--color-neutral-0)] px-4 py-4">
      <div className="mb-3 flex items-center gap-[10px]">
        <div className="ml-2 flex h-7 w-7 items-center justify-center rounded-[8px] bg-[var(--color-secondary-200)] p-[2px]">
          <img src={walletIcon} alt="" className="h-5 w-5" />
        </div>

        <h2 className="text-[length:var(--text-body-16-md-tighter)] leading-[var(--text-body-16-md-tighter--line-height)] font-[var(--text-body-16-md-tighter--font-weight)] text-[var(--color-neutral-900)]">
          오늘 남은 투자 예산
        </h2>
      </div>

      <div className="h-5 w-full overflow-hidden rounded-[27px] bg-[var(--color-neutral-50)]">
        <div
          className="h-full rounded-[27px] bg-[var(--color-primary)]"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="mt-2 flex items-baseline justify-end gap-2">
        <span className="text-[length:var(--text-caption-12-md)] leading-[var(--text-caption-12-md--line-height)] font-[var(--text-caption-12-md--font-weight)] text-[var(--color-neutral-400)]">
          {formatCurrency(totalBudget)}원 중
        </span>

        <strong className="text-[length:var(--text-heading-20-md)] leading-[var(--text-heading-20-md--line-height)] font-[var(--text-heading-20-md--font-weight)] text-[var(--color-neutral-900)]">
          {formatCurrency(remainingBudget)}원
        </strong>
      </div>
    </section>
  );
}

export default InvestBudgetCard;
