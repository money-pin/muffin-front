import type { ProfitHistoryPeriod } from "@/pages/invest/stats/types";

const PERIOD_TABS: { value: ProfitHistoryPeriod; label: string }[] = [
  { value: "day", label: "일" },
  { value: "week", label: "주" },
  { value: "month", label: "월" },
  { value: "year", label: "년" },
  { value: "all", label: "전체" },
];

interface ProfitHistoryPeriodTabsProps {
  value: ProfitHistoryPeriod;
  onChange: (value: ProfitHistoryPeriod) => void;
}

export default function ProfitHistoryPeriodTabs({
  value,
  onChange,
}: ProfitHistoryPeriodTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="누적 수익 기간 선택"
      className="bg-neutral-0 relative z-10 flex items-center gap-1 px-5 py-2"
    >
      {PERIOD_TABS.map((tab) => {
        const isSelected = tab.value === value;

        return (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={isSelected}
            className={`flex items-center justify-center rounded-lg px-3 py-2 transition-colors ${
              isSelected
                ? "bg-secondary-100 text-body-16-bd-tighter text-primary"
                : "text-body-16-md-tighter text-neutral-400"
            }`}
            onClick={() => onChange(tab.value)}
          >
            {tab.label}
          </button>
        );
      })}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-full h-2 bg-gradient-to-b from-black/[0.05] via-black/[0.02] to-transparent"
      />
    </div>
  );
}
