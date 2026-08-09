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

// 캐러셀 카드 스켈레톤 (TodayNewsCarouselCard: 310x291, padding 20, radius md)
function CarouselCardSkeleton() {
  return (
    <div className="bg-neutral-0 flex w-full flex-col gap-3 rounded-[16px] border border-neutral-100 p-5">
      {/* 이미지 310x201, radius sm */}
      <SkeletonBlock className="h-[201px] w-full rounded-[8px]" />
      {/* 텍스트 영역 310x78 space-between: 제목 프레임(44) + 메타(22) */}
      <div className="flex h-[78px] flex-col justify-between">
        {/* 제목 프레임 310x44 space-between: 18(full) + 18(241) */}
        <div className="flex h-[44px] flex-col justify-between">
          <SkeletonBlock className="h-[18px] w-full rounded-[4px]" />
          <SkeletonBlock className="h-[18px] w-[241px] max-w-full rounded-[4px]" />
        </div>
        {/* 메타 줄 310x22 space-between: 뱃지+날짜(102) / 조회수(80) */}
        <div className="flex h-[22px] items-center justify-between">
          <SkeletonBlock className="h-[18px] w-[102px] rounded-[4px]" />
          <SkeletonBlock className="h-[18px] w-[80px] rounded-[4px]" />
        </div>
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

// 뉴스 페이지 로딩 스켈레톤 (캐러셀 + 탭 + 리스트).
// 색상은 전부 neutral-100(#E2E2E2 = 명세 Neutral/Gray05).
// 탭 바는 실제 컴포넌트를 그대로 노출한다(명세상 탭은 스켈레톤 대상 아님).
export default function NewsPageSkeleton() {
  return (
    <div
      aria-busy="true"
      aria-label="뉴스 정보를 불러오는 중"
      className="relative flex min-h-dvh w-full flex-col bg-[#F5F5F5] pt-5 text-black"
    >
      {/* 따끈한 금융 소식 (캐러셀) */}
      <section className="flex w-full flex-col gap-3">
        <div className="flex h-[26px] items-center gap-[4px] px-5">
          <img
            src={megaphoneIcon}
            alt=""
            aria-hidden="true"
            className="h-[20px] w-[20px] shrink-0 object-contain"
            draggable={false}
          />
          <h2 className="text-[16px] leading-[160%] font-bold text-[#1B1B1B]">
            따끈한 금융 소식
          </h2>
        </div>
        {/* Carousel 자체 인디케이터(활성 도트)를 노출하지 않으려고
            컴포넌트로 감싸지 않고 바깥 레이아웃(px-5)만 재현한다. */}
        <div className="flex w-full flex-col items-center gap-3">
          <div className="w-full px-5">
            <CarouselCardSkeleton />
          </div>
          {/* 캐러셀 인디케이터 (명세: 회색 바 하나 76x8, radius round, #E2E2E2) */}
          <SkeletonBlock className="h-2 w-[76px] rounded-full" />
        </div>
      </section>

      {/* 탭 바 (실제 컴포넌트, 스켈레톤 아님) */}
      <div className="mt-8 w-full">
        <TabBar tabs={newsTabs} currentTab="all" onTabChange={() => {}} />
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
