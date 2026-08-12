import ProfitRateBadge from "@/pages/invest/components/ProfitRateBadge";

interface PercentageBadgeProps {
  rate: number;
  profitAmount?: number;
}

export default function PercentageBadge({
  rate,
  profitAmount,
}: PercentageBadgeProps) {
  return <ProfitRateBadge rate={rate} profitAmount={profitAmount} size="md" />;
}
