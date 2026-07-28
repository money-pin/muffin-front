import bullseyeIcon from "@/assets/icon-20px/bullseye.svg";
import calendarIcon from "@/assets/icon-20px/calendar.svg";
import noteIcon from "@/assets/icon-20px/note.svg";
import rankingIcon from "@/assets/icon-20px/ranking.svg";
import chartIcon from "@/assets/icon-20px/stats-graph.svg";
import chevronRightIcon from "@/assets/icon-24px/chevron-right-thin.svg";
import RankBadge from "@/pages/invest/stats/components/RankBadge";

function SkeletonBlock({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`rounded bg-neutral-100 ${className}`} />
  );
}

function SkeletonCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      aria-busy="true"
      className={`bg-neutral-0 rounded-2xl border border-neutral-100 p-5 ${className}`}
    >
      {children}
    </section>
  );
}

export default function StatsPageSkeleton() {
  return (
    <main className="flex flex-col gap-3 bg-neutral-50 px-5 pt-6 pb-24">
      <SkeletonCard className="flex items-center justify-between py-5 pr-4 pl-5">
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
        <div className="flex items-center gap-1">
          <SkeletonBlock className="h-[22px] w-12" />
          <img
            src={chevronRightIcon}
            alt=""
            aria-hidden="true"
            className="h-6 w-6 object-contain"
            draggable={false}
          />
        </div>
      </SkeletonCard>

      <SkeletonCard className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-1 px-1">
            <img
              src={noteIcon}
              alt=""
              aria-hidden="true"
              className="h-5 w-5 object-contain"
              draggable={false}
            />
            <h2 className="text-body-16-bd-tighter text-neutral-900">
              총 누적 수익
            </h2>
          </div>
          <SkeletonBlock className="h-6 w-[215px]" />
        </div>
        <img
          src={chevronRightIcon}
          alt=""
          aria-hidden="true"
          className="h-6 w-6 object-contain"
          draggable={false}
        />
      </SkeletonCard>

      <SkeletonCard className="flex flex-col items-center gap-4">
        <div className="flex w-full items-center gap-1 px-1">
          <img
            src={chartIcon}
            alt=""
            aria-hidden="true"
            className="h-5 w-5 object-contain"
            draggable={false}
          />
          <h2 className="text-body-16-bd-tighter text-neutral-900">
            수익률 추이
          </h2>
        </div>
        <SkeletonBlock className="h-[200px] w-full rounded-lg" />
        <p className="text-caption-12-md text-neutral-400">
          최근 7일간의 수익률 변화
        </p>
      </SkeletonCard>

      <SkeletonCard className="flex flex-col gap-5 pb-4">
        <div className="flex items-center gap-1 px-1">
          <img
            src={rankingIcon}
            alt=""
            aria-hidden="true"
            className="h-5 w-5 object-contain"
            draggable={false}
          />
          <h2 className="text-body-16-bd-tighter text-neutral-900">
            수익 TOP 3 섹터
          </h2>
        </div>
        <div className="flex flex-col gap-1">
          {[1, 2, 3].map((rank) => (
            <div
              key={rank}
              className="flex items-center justify-between px-2 py-3"
            >
              <div className="flex items-center gap-3">
                <RankBadge rank={rank as 1 | 2 | 3} />
                <SkeletonBlock className="h-6 w-[84px]" />
              </div>
              <SkeletonBlock className="h-6 w-[140px]" />
            </div>
          ))}
        </div>
      </SkeletonCard>

      <SkeletonCard className="flex flex-col gap-4">
        <div className="flex items-center gap-1 px-1">
          <img
            src={bullseyeIcon}
            alt=""
            aria-hidden="true"
            className="h-5 w-5 object-contain"
            draggable={false}
          />
          <h2 className="text-body-16-bd-tighter text-neutral-900">
            나의 투자 성향
          </h2>
        </div>
        <SkeletonBlock className="h-[49px] w-full rounded-xl" />
        <SkeletonBlock className="h-[22px] w-[273px]" />
        <div className="flex flex-col gap-2">
          <SkeletonBlock className="h-4 w-[236px]" />
          <SkeletonBlock className="h-4 w-[236px]" />
          <SkeletonBlock className="h-4 w-[236px]" />
        </div>
      </SkeletonCard>
    </main>
  );
}
