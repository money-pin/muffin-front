import calendarIcon from "@/assets/icon-20px/calendar.svg";

function SkeletonBlock({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`rounded bg-neutral-100 ${className}`} />
  );
}

function SectorSkeletonCard() {
  return (
    <article className="bg-neutral-0 flex min-h-[84px] items-center justify-between gap-3 rounded-xl border border-neutral-100 p-4">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <SkeletonBlock className="h-10 w-10 shrink-0 rounded-xl" />
        <SkeletonBlock className="h-6 w-full max-w-[84px]" />
      </div>

      <div className="flex shrink-0 flex-col items-end gap-2">
        <SkeletonBlock className="h-6 w-20" />
        <SkeletonBlock className="h-5 w-[100px]" />
      </div>
    </article>
  );
}

export default function RecentPerformanceSheetSkeleton() {
  return (
    <div
      aria-busy="true"
      aria-label="최근 투자 성과를 불러오는 중"
      className="flex flex-col gap-8 px-5 pb-10"
    >
      <section className="flex flex-col gap-5">
        <div className="flex items-center gap-2 px-1">
          <div className="flex items-center gap-1">
            <img
              src={calendarIcon}
              alt=""
              aria-hidden="true"
              className="h-5 w-5 object-contain"
              draggable={false}
            />
            <h2 className="text-body-16-bd-tighter text-neutral-900">
              최근 투자 성과
            </h2>
          </div>
          <SkeletonBlock className="h-[22px] w-12" />
        </div>

        <section
          aria-busy="true"
          className="bg-neutral-0 flex flex-col gap-2 rounded-xl border border-neutral-100 p-4"
        >
          <div className="flex items-center justify-between gap-3">
            <SkeletonBlock className="h-5 w-12" />
            <div className="flex shrink-0 items-center gap-2">
              <SkeletonBlock className="h-6 w-[100px]" />
              <SkeletonBlock className="h-6 w-[51px]" />
            </div>
          </div>
          <div className="flex items-center justify-between gap-3">
            <SkeletonBlock className="h-5 w-16" />
            <SkeletonBlock className="h-5 w-[100px]" />
          </div>
        </section>
      </section>

      <section className="flex flex-col gap-3">
        <h3 className="text-body-16-bd-tighter text-neutral-900">
          섹터별 상세 내역
        </h3>

        <div className="flex flex-col gap-2" aria-busy="true">
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
