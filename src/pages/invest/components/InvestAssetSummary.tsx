import ProfitRateBadge from "@/pages/invest/components/ProfitRateBadge";
import {
  formatCurrency,
  formatSignedCurrency,
  getProfitColorClass,
} from "@/pages/invest/utils/profitFormat";

interface InvestAssetSummaryProps {
  totalAsset?: number;
  profitAmount?: number;
  profitRate?: number;
  isLoading?: boolean;
}

export default function InvestAssetSummary({
  totalAsset,
  profitAmount,
  profitRate,
  isLoading = false,
}: InvestAssetSummaryProps) {
  const shouldShowSkeleton =
    isLoading ||
    totalAsset === undefined ||
    profitAmount === undefined ||
    profitRate === undefined;

  return (
    <section className="bg-neutral-0 flex w-full flex-col gap-1 px-5 py-4">
      <p className="text-caption-12-md text-neutral-400">총 자산</p>

      {shouldShowSkeleton ? (
        <div className="flex min-h-[36px] w-full items-center justify-between gap-3">
          <div
            aria-hidden="true"
            className="h-7 w-[155px] rounded bg-neutral-100"
          />

          <div
            aria-hidden="true"
            className="h-[22px] w-[124px] rounded bg-neutral-100"
          />
        </div>
      ) : (
        <div className="flex min-h-[36px] w-full items-center justify-between gap-3">
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
      )}
    </section>
  );
}
