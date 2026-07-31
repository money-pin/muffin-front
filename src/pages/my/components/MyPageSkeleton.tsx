import SectionHeader from "@/components/common/SectionHeader";

function SkeletonBlock({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`rounded bg-neutral-100 ${className}`} />
  );
}

// 마이페이지 로딩 스켈레톤 (닉네임 조회 동안 노출)
// 실제 구조를 회색 블록으로 치환하고 섹션 헤더는 유지한다.
export default function MyPageSkeleton() {
  return (
    <div
      aria-busy="true"
      aria-label="마이페이지 정보를 불러오는 중"
      className="flex min-h-full flex-col"
    >
      <div className="bg-white pb-6">
        <header className="flex h-[52px] items-center justify-end px-5">
          <SkeletonBlock className="size-6" />
        </header>

        {/* 프로필: 캐릭터 + 닉네임 */}
        <section className="flex flex-col items-center">
          <SkeletonBlock className="h-[100px] w-[100px] rounded-full" />
          <SkeletonBlock className="mt-3 h-7 w-28" />
        </section>

        {/* 스트릭 주간 카드 */}
        <div className="mt-5 px-5">
          <div className="flex w-full flex-col">
            <div className="px-4">
              <SkeletonBlock className="h-7 w-28 rounded-t-[8px]" />
            </div>
            <div className="flex w-full flex-col items-center gap-2 rounded-[16px] bg-white px-4 py-4 shadow-[0px_1px_3px_rgba(0,0,0,0.15)]">
              <div className="flex gap-[15px]">
                {Array.from({ length: 7 }).map((_, index) => (
                  <SkeletonBlock key={index} className="h-4 w-7" />
                ))}
              </div>
              <div className="flex gap-[15px]">
                {Array.from({ length: 7 }).map((_, index) => (
                  <SkeletonBlock key={index} className="size-7 rounded-full" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-9 border-t border-neutral-100 bg-[#f9f9f9] px-5 pt-6 pb-9">
        <section className="flex flex-col gap-4">
          <SectionHeader title="학습 저장소" />
          <div className="flex gap-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <SkeletonBlock
                key={index}
                className="h-[92px] flex-1 rounded-[16px]"
              />
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <SectionHeader title="최근 읽은 뉴스" />
          <div className="flex gap-3 overflow-hidden">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="flex w-[130px] shrink-0 flex-col gap-2"
              >
                <SkeletonBlock className="h-[130px] w-[130px] rounded-[12px]" />
                <SkeletonBlock className="h-4 w-full" />
                <SkeletonBlock className="h-4 w-2/3" />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
