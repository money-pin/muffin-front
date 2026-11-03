import TabBar from "@/components/common/TabBar";
import megaphoneIcon from "@/assets/icon-20px/megaphone.svg";

const newsTabs = [
  { value: "all", label: "전체" },
  { value: "economy", label: "경제" },
  { value: "stock", label: "증권" },
  { value: "world", label: "세계" },
] as const;

function SkeletonBlock({ className = "" }: { className?: string }) {
  return <div aria-hidden="true" className={`bg-neutral-100 ${className}`} />;
}

// 오늘의 브리핑 카드 스켈레톤 (TodayBriefingCard: padding 20, radius 16, 한 줄 요약 + 이슈 3줄)
function BriefingCardSkeleton() {
  return (
    <div className="bg-neutral-0 flex w-full flex-col gap-4 rounded-[16px] border border-neutral-100 p-5">
      <div className="flex h-[44px] flex-col justify-between">
        <SkeletonBlock className="h-[18px] w-full rounded-[4px]" />
        <SkeletonBlock className="h-[18px] w-[180px] max-w-full rounded-[4px]" />
      </div>
      <div className="flex flex-col gap-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="flex h-[22px] items-center gap-1">
            <SkeletonBlock className="h-[22px] w-[45px] rounded-[4px]" />
            <SkeletonBlock className="h-4 w-[160px] max-w-full rounded-[4px]" />
          </div>
        ))}
      </div>
    </div>
  );
}

// 리스트 카드 스켈레톤 (NewsCard: 350x100, radius 12, border 1px, padding L/R 12)
function NewsCardSkeleton() {
  return (
    <div className="bg-neutral-0 flex h-[100px] w-full items-center gap-4 rounded-[12px] border border-neutral-100 px-3">
      {/* 썸네일 74x74, radius 8 */}
      <SkeletonBlock className="size-[74px] flex-shrink-0 rounded-[8px]" />
      {/* 텍스트 영역 236 Fill x 74 space-between: 제목 그룹(38) + 메타(22) */}
      <div className="flex min-w-0 flex-1 flex-col justify-between self-stretch py-[13px]">
        {/* 제목 그룹 236x38, gap 8: 16(full) + 16(112) */}
        <div className="flex flex-col gap-2">
          <SkeletonBlock className="h-4 w-full rounded-[4px]" />
          <SkeletonBlock className="h-4 w-[112px] max-w-full rounded-[4px]" />
        </div>
        {/* 메타 줄 236x22 space-between: 뱃지+날짜(102) / 조회수(80) */}
        <div className="flex h-[16px] items-center justify-between">
          <SkeletonBlock className="h-4 w-[102px] rounded-[4px]" />
          <SkeletonBlock className="h-4 w-[80px] rounded-[4px]" />
        </div>
      </div>
    </div>
  );
}

// 뉴스 페이지 로딩 스켈레톤 (오늘의 브리핑 + 탭 + 리스트).
// 색상은 전부 neutral-100(#E2E2E2 = 명세 Neutral/Gray05).
// 탭 바는 실제 컴포넌트를 그대로 노출한다(명세상 탭은 스켈레톤 대상 아님).
export default function NewsPageSkeleton() {
  return (
    <div
      aria-busy="true"
      aria-label="뉴스 정보를 불러오는 중"
      className="relative flex min-h-dvh w-full flex-col bg-[#F5F5F5] pt-5 text-black"
    >
      {/* 오늘의 브리핑 */}
      <section className="flex w-full flex-col gap-2 px-5">
        <div className="flex h-[26px] items-center gap-[4px] px-1">
          <img
            src={megaphoneIcon}
            alt=""
            aria-hidden="true"
            className="h-[20px] w-[20px] shrink-0 object-contain"
            draggable={false}
          />
          <h2 className="text-[16px] leading-[160%] font-bold text-[#1B1B1B]">
            오늘의 브리핑
          </h2>
        </div>
        <BriefingCardSkeleton />
      </section>

      {/* 탭 바 (실제 컴포넌트, 스켈레톤 아님) */}
      <div className="mt-8 w-full">
        <TabBar
          tabs={newsTabs}
          currentTab="all"
          onTabChange={() => {}}
          className="bg-neutral-50"
        />
      </div>

      {/* 뉴스 리스트 (컨테이너 464 높이에 카드 4개, gap 8) */}
      <section className="mt-6 flex flex-col gap-2 px-5 pb-24">
        {Array.from({ length: 4 }).map((_, index) => (
          <NewsCardSkeleton key={index} />
        ))}
      </section>
    </div>
  );
}
