import ProfitRateBadge from "@/pages/invest/components/ProfitRateBadge";

interface InvestAssetSummaryProps {
  totalAsset: number;
  profitAmount: number;
  profitRate: number;
}

function formatCurrency(value: number) {
  return `${Math.abs(value).toLocaleString("ko-KR")}원`;
}

function getSignedCurrency(value: number) {
  if (value > 0) return `+${formatCurrency(value)}`;
  if (value < 0) return `-${formatCurrency(value)}`;

  return formatCurrency(value);
}

function getProfitColorClass(value: number) {
  if (value > 0) return "text-positive";
  if (value < 0) return "text-negative";

  return "text-neutral-600";
}

export default function InvestAssetSummary({
  totalAsset,
  profitAmount,
  profitRate,
}: InvestAssetSummaryProps) {
  return (
    <section className="flex w-full flex-col gap-1 bg-neutral-0 px-5 py-4">
      <p className="text-caption-12-md text-neutral-400">총 자산</p>

      <div className="flex w-full items-center justify-between gap-3">
        <p className="text-heading-28-md text-neutral-900">
          {formatCurrency(totalAsset)}
        </p>

        <div
          className={`flex shrink-0 items-center gap-2 ${getProfitColorClass(
            profitAmount,
          )}`}
        >
          <p className="text-body-16-bd-tighter">
            {getSignedCurrency(profitAmount)}
          </p>

          <ProfitRateBadge rate={profitRate} />
        </div>
      </div>
    </section>
  );
}
