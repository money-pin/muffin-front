import { useNavigate } from "react-router-dom";
import bookmarkLineWhite from "@/assets/icon-24px/bookmark-line-white.svg";
import newsImpactNegativeIcon from "@/assets/icon-16px/news-impact-negative.svg";
import newsImpactPositiveIcon from "@/assets/icon-16px/news-impact-positive.svg";
import chevronLeftIcon from "@/assets/icon-28px/chevron-left.svg";
import ScrollToTopButton from "./ScrollToTopButton";

function SkeletonBlock({ className = "" }: { className?: string }) {
  return <div aria-hidden="true" className={`bg-neutral-100 ${className}`} />;
}

// 긍정/부정 반응 카드 스켈레톤
// (ImpactCard: rounded-12, border neutral-100, p-4, gap-3)
// 명세: 헤더(아이콘+"긍정/부정 반응이 나타나요!")는 실제 노출, 섹터 태그 자리만 스켈레톤.
function ImpactCardSkeleton({ type }: { type: "positive" | "negative" }) {
  const isPositive = type === "positive";
  const iconSrc = isPositive ? newsImpactPositiveIcon : newsImpactNegativeIcon;

  return (
    <section className="bg-neutral-0 flex w-full flex-col gap-3 rounded-[12px] border border-neutral-100 p-4">
      {/* 실제 헤더 (아이콘 + 텍스트) */}
      <div className="flex items-center gap-1 px-1">
        <img
          src={iconSrc}
          alt=""
          aria-hidden="true"
          className="size-4 shrink-0 object-contain"
          draggable={false}
        />
        <p className="text-body-16-md-tighter text-neutral-700">
          <span
            className={`font-bold ${
              isPositive ? "text-positive" : "text-negative"
            }`}
          >
            {isPositive ? "긍정" : "부정"}
          </span>{" "}
          반응이 나타나요!
        </p>
      </div>

      {/* 섹터 태그 자리만 스켈레톤 (49×22, radius/xs) */}
      <div className="flex flex-wrap gap-2">
        <SkeletonBlock className="h-[22px] w-[49px] rounded-[4px]" />
        <SkeletonBlock className="h-[22px] w-[49px] rounded-[4px]" />
        <SkeletonBlock className="h-[22px] w-[49px] rounded-[4px]" />
      </div>
    </section>
  );
}

// 해설 카드 스켈레톤 (EconomicsCard)
// 명세: 348 Hug, radius 16, padding 20, gap 20, shadow.
// 내부: 제목 블록(308×52, 2줄) + 본문 블록(308×228, 문단 2개 × 4줄).
// 각 줄 308 Fill × 20(radius 4).
function ExplanationCardSkeleton() {
  return (
    <div className="bg-neutral-0 flex w-full flex-col gap-5 rounded-[16px] p-5 shadow-[0_0_4px_rgba(0,0,0,0.08)]">
      {/* 제목 블록 (52 Hug, gap 8, 2줄 · 2줄 160×20) */}
      <div className="flex flex-col gap-2">
        <SkeletonBlock className="h-5 w-full rounded-[4px]" />
        <SkeletonBlock className="h-5 w-[160px] rounded-[4px]" />
      </div>

      {/* 본문 블록 (228 Hug, gap 20, 문단 2개) */}
      <div className="flex flex-col gap-5">
        {/* 문단 1 (104 Hug, gap 8, 4줄 · 마지막 줄 짧음) */}
        <div className="flex flex-col gap-2">
          <SkeletonBlock className="h-5 w-full rounded-[4px]" />
          <SkeletonBlock className="h-5 w-full rounded-[4px]" />
          <SkeletonBlock className="h-5 w-full rounded-[4px]" />
          <SkeletonBlock className="h-5 w-[42%] rounded-[4px]" />
        </div>
        {/* 문단 2 (104 Hug, gap 8, 4줄 · 마지막 줄 140×20) */}
        <div className="flex flex-col gap-2">
          <SkeletonBlock className="h-5 w-full rounded-[4px]" />
          <SkeletonBlock className="h-5 w-full rounded-[4px]" />
          <SkeletonBlock className="h-5 w-full rounded-[4px]" />
          <SkeletonBlock className="h-5 w-[140px] rounded-[4px]" />
        </div>
      </div>
    </div>
  );
}

// 뉴스 상세 페이지 로딩 스켈레톤.
// 색상은 전부 neutral-100(#E2E2E2 = 명세 Neutral/Gray05), 상단 이미지만 neutral-900.
// 뒤로가기 버튼(header)은 실제 컴포넌트를 그대로 노출한다(네비게이션 요소).
export default function NewsDetailPageSkeleton() {
  const navigate = useNavigate();

  return (
    <div
      aria-busy="true"
      aria-label="뉴스를 불러오는 중"
      className="relative mx-auto flex min-h-dvh w-full max-w-[var(--max-width-app)] flex-col bg-neutral-50 text-neutral-900"
    >
      <div className="relative w-full flex-1 overflow-y-auto">
        <article className="bg-neutral-0 flex w-full flex-col">
          {/* 상단 이미지 영역 (225px, neutral-900) */}
          <div className="relative h-[225px] w-full shrink-0 overflow-hidden bg-neutral-900">
            {/* 헤더: 뒤로가기 + 북마크 (실제 아이콘 노출) */}
            <header className="absolute top-3 left-0 z-10 flex w-full items-center justify-between px-5">
              <button
                type="button"
                onClick={() => navigate(-1)}
                aria-label="뒤로가기"
              >
                <img
                  src={chevronLeftIcon}
                  alt=""
                  aria-hidden="true"
                  className="size-7 brightness-0 invert"
                  draggable={false}
                />
              </button>

              <img
                src={bookmarkLineWhite}
                alt=""
                aria-hidden="true"
                className="size-6 object-contain"
                draggable={false}
              />
            </header>

            {/* 하단 제목 + 뱃지/날짜 */}
            <div className="absolute bottom-5 left-0 z-10 flex w-full flex-col gap-2 px-5">
              {/* 제목 2줄 (1줄 full, 2줄 160×24) */}
              <div className="flex flex-col gap-2">
                <SkeletonBlock className="h-6 w-full rounded-[4px] bg-neutral-700" />
                <SkeletonBlock className="h-6 w-[160px] rounded-[4px] bg-neutral-700" />
              </div>
              {/* 뱃지 34×22 + 날짜 68×19 */}
              <div className="flex items-center gap-2">
                <SkeletonBlock className="h-[22px] w-[34px] rounded-[4px] bg-neutral-700" />
                <SkeletonBlock className="h-[19px] w-[68px] rounded-[4px] bg-neutral-700" />
              </div>
            </div>
          </div>

          {/* 본문 섹션 */}
          <section className="flex w-full flex-col gap-1 px-5 pt-6 pb-5">
            {/* 본문 (350 Fill × 232 Hug, Vertical, gap 24, 문단 2개) */}
            <div className="flex flex-col gap-6">
              {/* 문단 1 (104 Hug, gap 8, 4줄 · 마지막 줄 짧음) */}
              <div className="flex flex-col gap-2">
                <SkeletonBlock className="h-5 w-full rounded-[4px]" />
                <SkeletonBlock className="h-5 w-full rounded-[4px]" />
                <SkeletonBlock className="h-5 w-full rounded-[4px]" />
                <SkeletonBlock className="h-5 w-[42%] rounded-[4px]" />
              </div>
              {/* 문단 2 (104 Hug, gap 8, 4줄 · 마지막 줄 140×20) */}
              <div className="flex flex-col gap-2">
                <SkeletonBlock className="h-5 w-full rounded-[4px]" />
                <SkeletonBlock className="h-5 w-full rounded-[4px]" />
                <SkeletonBlock className="h-5 w-full rounded-[4px]" />
                <SkeletonBlock className="h-5 w-[140px] rounded-[4px]" />
              </div>
            </div>

            {/* 원문 뉴스 보기 (실제 텍스트 노출, h-45 우측 정렬) */}
            <div className="text-body-16-md-tighter ml-auto flex h-[45px] items-center gap-2 pr-4 text-neutral-400">
              <span aria-hidden="true" className="text-[20px] leading-none">
                ↗
              </span>
              원문 뉴스 보기
            </div>

            {/* 긍정/부정 반응 카드 (세로 2개, 데이터 유무 모르니 항상 노출) */}
            <div className="flex flex-col gap-2 pt-1">
              <ImpactCardSkeleton type="positive" />
              <ImpactCardSkeleton type="negative" />
            </div>
          </section>
        </article>

        {/* 해설 카드 섹션 (neutral-50/80 배경, 카드 3개) */}
        <section className="flex w-full flex-col gap-3 bg-neutral-50/80 px-5 pt-5 pb-10">
          <ExplanationCardSkeleton />
          <ExplanationCardSkeleton />
          <ExplanationCardSkeleton />
        </section>
      </div>

      {/* 스크롤투탑 버튼 (명세대로 노출, 로딩 중엔 동작 없음) */}
      <ScrollToTopButton
        onClick={() => {}}
        className="fixed right-[calc((100vw-min(100vw,var(--max-width-app)))/2+20px)] bottom-6 z-40"
      />
    </div>
  );
}
