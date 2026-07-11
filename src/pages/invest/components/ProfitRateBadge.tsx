import Badge from "@/components/common/Badge";

interface ProfitRateBadgeProps {
  rate: number;
  size?: "sm" | "md";
  className?: string;
}

export default function ProfitRateBadge({
  rate,
  size = "sm",
  className = "",
}: ProfitRateBadgeProps) {
  const sizeClass = size === "md" ? "h-6" : "h-[22px]";

  if (rate === 0) {
    return (
      <Badge variant="gray" size="md" className={`${sizeClass} ${className}`}>
        0.0%
      </Badge>
    );
  }

  const isNegative = rate < 0;
  const variant = isNegative ? "negative" : "positive";
  const icon = isNegative ? "▼" : "▲";

  return (
    <Badge variant={variant} size="md" className={`${sizeClass} ${className}`}>
      <span aria-hidden="true" className="text-[8px] leading-none">
        {icon}
      </span>
      <span>{Math.abs(rate).toFixed(1)}%</span>
    </Badge>
  );
}
