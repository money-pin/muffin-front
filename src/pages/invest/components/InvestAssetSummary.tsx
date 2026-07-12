import ProfitRateBadge from "@/pages/invest/components/ProfitRateBadge";
import {
  formatCurrency,
  formatSignedCurrency,
  getProfitColorClass,
} from "@/pages/invest/utils/profitFormat";

interface InvestAssetSummaryProps {
  totalAsset: number;
  profitAmount: number;
  profitRate: number;
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
            {formatSignedCurrency(profitAmount)}
          </p>

          <ProfitRateBadge rate={profitRate} />
        </div>
      </div>
    </section>
  );
}
