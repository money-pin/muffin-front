import chevronDownIcon from "@/assets/icon-20px/chevron-down.svg";
import polygonIcon from "@/assets/investment/investment-polygon.svg";
import type { ProfitHistorySortKey } from "@/pages/invest/stats/types";

const SORT_LABELS: Record<ProfitHistorySortKey, string> = {
  AMOUNT_DESC: "수익금 높은 순",
  AMOUNT_ASC: "수익금 낮은 순",
  RATE_DESC: "수익률 높은 순",
  RATE_ASC: "수익률 낮은 순",
};

interface ProfitHistoryPageSkeletonProps {
  sortKey: ProfitHistorySortKey;
}

function SkeletonBlock({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`rounded bg-neutral-100 ${className}`} />
  );
}

function SectorSkeletonCard() {
  return (
    <article className="bg-neutral-0 flex min-h-[84px] w-full items-center justify-between gap-3 rounded-xl border border-neutral-100 p-4">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <SkeletonBlock className="size-10 shrink-0 rounded-xl" />
        <SkeletonBlock className="h-6 w-full max-w-[84px]" />
      </div>

      <div className="flex shrink-0 flex-col items-end gap-2">
        <SkeletonBlock className="h-6 w-20" />
        <SkeletonBlock className="h-5 w-[100px]" />
      </div>
    </article>
  );
}

export default function ProfitHistoryPageSkeleton({
  sortKey,
}: ProfitHistoryPageSkeletonProps) {
  return (
    <div
      aria-busy="true"
      aria-label="누적 수익 내역을 불러오는 중"
      className="flex flex-1 flex-col"
    >
      <section className="bg-neutral-0 flex flex-col gap-5 px-5 py-6">
        <div className="flex items-center gap-2">
          <img
            src={polygonIcon}
            alt=""
            aria-hidden="true"
            className="h-[9px] w-2 shrink-0 opacity-15"
            draggable={false}
          />
          <SkeletonBlock className="h-6 w-[109px]" />
          <img
            src={polygonIcon}
            alt=""
            aria-hidden="true"
            className="h-[9px] w-2 shrink-0 rotate-180 opacity-15"
            draggable={false}
          />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-3">
            <span className="text-body-16-md shrink-0 text-neutral-600">
              총 수익
            </span>
            <div className="flex min-w-0 items-center justify-end gap-2.5">
              <SkeletonBlock className="h-6 w-[120px] max-w-[45vw]" />
              <SkeletonBlock className="h-6 w-[51px] shrink-0" />
            </div>
          </div>

          <div className="flex items-center justify-between gap-3">
            <span className="text-body-16-md shrink-0 text-neutral-600">
              총 투자금
            </span>
            <SkeletonBlock className="h-6 w-[100px]" />
          </div>
        </div>
      </section>

      <div aria-hidden="true" className="h-8 shrink-0 bg-neutral-50" />

      <section className="bg-neutral-0 flex flex-col gap-4 px-5 pt-5 pb-9">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-body-16-bd-tighter text-neutral-900">
            섹터별 상세 내역
          </h2>
          <div className="text-body-14-md flex shrink-0 items-center gap-1 text-neutral-600">
            <span>{SORT_LABELS[sortKey]}</span>
            <img
              src={chevronDownIcon}
              alt=""
              aria-hidden="true"
              className="size-5 rotate-180"
              draggable={false}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <SectorSkeletonCard />
          <SectorSkeletonCard />
          <SectorSkeletonCard />
          <SectorSkeletonCard />
          <SectorSkeletonCard />
        </div>
      </section>
    </div>
  );
}
