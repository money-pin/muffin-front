import wordSaveIcon from "@/assets/icon-28px/wordsave.svg";

function SkeletonBlock({ className = "" }: { className?: string }) {
  return <div aria-hidden="true" className={`bg-neutral-100 ${className}`} />;
}

// 용어 바텀시트 로딩 스켈레톤.
// 색상은 전부 neutral-100(#E2E2E2 = 명세 Neutral/Gray05).
// 저장 아이콘은 실제 노출(로딩 중엔 isSaved를 모르므로 미저장 아이콘 고정·비활성).
// 실제 콘텐츠(NewsDetailPage BottomSheet children)와 동일한 레이아웃 위에 얹는다.
export default function TermBottomSheetSkeleton() {
  return (
    <div
      aria-busy="true"
      aria-label="용어를 불러오는 중"
      className="flex min-h-full flex-col px-5 pt-2 pb-8"
    >
      {/* 헤더 (Fill×46, space-between, 하단 border 1px neutral-100, py-2) */}
      <div className="flex w-full items-center justify-between border-b border-neutral-100 py-2">
        {/* 제목 자리 (120×24, radius 4) */}
        <SkeletonBlock className="h-6 w-[120px] rounded-[4px]" />

        {/* 저장 아이콘 (실제 노출, 비활성) */}
        <div
          className="flex size-7 shrink-0 items-center justify-center"
          aria-hidden="true"
        >
          <img
            src={wordSaveIcon}
            alt=""
            className="size-7 object-contain"
            draggable={false}
          />
        </div>
      </div>

      {/* 본문 (Fill, gap 8, 각 줄 20px · 마지막 줄 252) */}
      <div className="flex flex-col gap-2 pt-4">
        <SkeletonBlock className="h-5 w-full rounded-[4px]" />
        <SkeletonBlock className="h-5 w-[252px] max-w-full rounded-[4px]" />
      </div>
    </div>
  );
}
