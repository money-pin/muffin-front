interface PercentageBadgeProps {
  rate: number; // 변동률(%) — 음수면 하락(파랑), 양수면 상승(빨강)
}

// Figma PercentageBadge: ▲/▼ 8px + 12px Bold, h-24, rounded-4
// 상승 = positive(빨강) / 하락 = negative(파랑) — 국내 증시 색 관례
export default function PercentageBadge({ rate }: PercentageBadgeProps) {
  const up = rate >= 0;

  return (
    <span
      className={`flex h-6 items-center gap-1 rounded-[4px] py-1 pl-1.5 pr-1 ${
        up ? "bg-positive-50 text-positive" : "bg-negative-50 text-negative"
      }`}
    >
      <span className="text-[8px] leading-none">{up ? "▲" : "▼"}</span>
      <span className="text-caption-12-bd">{Math.abs(rate)}%</span>
    </span>
  );
}
