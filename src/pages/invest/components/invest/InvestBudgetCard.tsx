import type { ReactNode } from "react";

interface InvestBudgetCardProps {
  children?: ReactNode;
}

function InvestBudgetCard({ children }: InvestBudgetCardProps) {
  return (
    <section className="flex h-[128px] w-full max-w-[351px] flex-col gap-3 rounded-[16px] border border-[var(--color-neutral-100)] bg-[var(--color-neutral-0)] p-4">
      {children}
    </section>
  );
}

export default InvestBudgetCard;
