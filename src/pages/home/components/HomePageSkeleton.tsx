import Logo from "@/components/common/Logo";
import SectionHeader from "@/components/common/SectionHeader";
import megaphoneIcon from "@/assets/icon-20px/megaphone.svg";
import rankingIcon from "@/assets/icon-20px/ranking.svg";
import calendarIcon from "@/assets/icon-20px/calendar.svg";

// Figma RankBadge: 1위 금색 / 2위 은색 / 3위 동색 (TopSectorList와 동일)
const RANK_STYLE: Record<1 | 2 | 3, string> = {
  1: "bg-[#ffd400] text-[#331900]",
  2: "bg-[#bababa] text-white",
  3: "bg-[#de7813] text-white",
};

function SkeletonBlock({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`rounded bg-neutral-100 ${className}`} />
  );
}

// 홈 로딩 스켈레톤 (Figma "Skeleton UI" 홈 프레임 기준)
// 섹션 헤더·라벨·랭크 배지는 실제 UI를 유지하고 데이터 영역만 회색 블록으로 치환한다.
export default function HomePageSkeleton() {
  return (
    <div
      aria-busy="true"
      aria-label="홈 정보를 불러오는 중"
      className="flex min-h-full flex-col bg-[linear-gradient(180deg,rgba(255,255,255,0.2)_23.6%,rgba(255,194,102,0.2)_36.4%),linear-gradient(#fff,#fff)]"
    >
      <header className="flex h-[52px] shrink-0 items-center px-5">
        <Logo size="xs" />
      </header>

      {/* 인사말 */}
      <div className="px-5 pt-4">
        <SkeletonBlock className="h-6 w-48" />
      </div>

      {/* 총자산 카드 */}
      <div className="mt-3 px-5">
        <div className="flex w-full flex-col">
          <div className="px-4">
            <SkeletonBlock className="h-7 w-28 rounded-t-[8px]" />
          </div>
          <div className="flex w-full flex-col gap-3 rounded-[16px] bg-white px-4 pt-5 pb-4 shadow-[0px_1px_3px_rgba(0,0,0,0.15)]">
            <div className="flex flex-col gap-2 px-1">
              <SkeletonBlock className="h-4 w-24" />
              <div className="flex w-full items-center justify-between">
                <SkeletonBlock className="h-8 w-40" />
                <SkeletonBlock className="h-6 w-20" />
              </div>
            </div>

            <div className="flex w-full items-center justify-between rounded-[8px] border border-neutral-100 py-[13px] pr-[17px] pl-[13px]">
              <span className="flex items-center gap-2">
                <img
                  src={calendarIcon}
                  alt=""
                  aria-hidden="true"
                  className="h-5 w-5"
                  draggable={false}
                />
                <span className="text-body-14-bd text-neutral-900">
                  최근 투자 성과
                </span>
              </span>
              <SkeletonBlock className="h-[22px] w-14" />
            </div>
          </div>
        </div>
      </div>

      {/* 흰색 라운드 시트: 퀴즈 배너 · 금융 소식 · 수익 TOP3 */}
      <div className="mt-7 flex flex-1 flex-col gap-9 rounded-t-[24px] bg-white pt-6 pb-9 shadow-[0px_-3px_7px_rgba(0,0,0,0.1)]">
        <div className="px-5">
          <SkeletonBlock className="h-[72px] w-full rounded-[16px]" />
        </div>

        <section className="flex flex-col gap-2">
          <div className="px-6">
            <SectionHeader
              title="따끈한 금융 소식"
              icon={
                <img
                  src={megaphoneIcon}
                  alt=""
                  aria-hidden="true"
                  className="h-5 w-5"
                  draggable={false}
                />
              }
            />
          </div>
          <div className="px-6">
            <SkeletonBlock className="h-[150px] w-full rounded-[12px]" />
            <div className="mt-3 flex flex-col gap-2">
              <SkeletonBlock className="h-4 w-3/4" />
              <SkeletonBlock className="h-4 w-1/2" />
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-2 px-5">
          <div className="px-1">
            <SectionHeader
              title="수익 TOP 3 섹터"
              icon={
                <img
                  src={rankingIcon}
                  alt=""
                  aria-hidden="true"
                  className="h-5 w-5"
                  draggable={false}
                />
              }
            />
          </div>
          <div className="flex w-full flex-col rounded-[16px] border border-neutral-100 bg-white px-5 py-2">
            {([1, 2, 3] as const).map((rank) => (
              <div
                key={rank}
                className="flex w-full items-center justify-between py-3"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-[8px] text-[16px] leading-none font-bold ${RANK_STYLE[rank]}`}
                  >
                    {rank}
                  </span>
                  <SkeletonBlock className="h-5 w-20" />
                </div>
                <SkeletonBlock className="h-5 w-24 shrink-0" />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
