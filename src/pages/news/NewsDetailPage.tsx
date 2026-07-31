import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ScrollToTopButton from "./components/ScrollToTopButton";
import BottomSheet from "@/components/common/BottomSheet";
import bookmarkLine from "@/assets/icon-24px/bookmark-line-gray5.svg";
import bookmarkFill from "@/assets/icon-24px/bookmark-fill.svg";
import wordSaveIcon from "@/assets/icon-28px/wordsave.svg";
import wordSaveActiveIcon from "@/assets/icon-28px/wordsave-active.svg";
import {
  useNewsDetail,
  useReadNews,
  useSectorImpacts,
  useExplanationCards,
  useTerm,
  useToggleScrap,
  useToggleTermSave,
} from "./newsQueries";
import { getNewsImage, formatRelativeDate } from "@/lib/newsFormat";
import type { SectorImpactItem } from "@/lib/newsApi";

// 섹터 영향도 5단계 → 긍정/부정 박스로 분류. NEUTRAL은 제외.
function splitImpacts(impacts: SectorImpactItem[]) {
  const positive = impacts.filter(
    (s) => s.impact === "STRONG_POSITIVE" || s.impact === "POSITIVE",
  );
  const negative = impacts.filter(
    (s) => s.impact === "STRONG_NEGATIVE" || s.impact === "NEGATIVE",
  );
  return { positive, negative };
}

export default function NewsDetailPage() {
  const navigate = useNavigate();
  const { newsId } = useParams<{ newsId: string }>();
  const idNum = newsId ? Number(newsId) : NaN;
  const containerRef = useRef<HTMLDivElement>(null);

  const [showScrollBtn, setShowScrollBtn] = useState(false);

  // 용어 바텀시트: 클릭된 termId를 담아 useTerm으로 조회
  const [selectedTermId, setSelectedTermId] = useState<number | null>(null);
  const isTermSheetOpen = selectedTermId != null;

  // ── 데이터 조회 ──
  const { data: detail, isLoading, isError } = useNewsDetail(idNum);
  const { data: impactData } = useSectorImpacts(idNum);
  const { data: cardData } = useExplanationCards(idNum);
  const { data: termData } = useTerm(selectedTermId);

  // ── 뮤테이션 ──
  const { mutate: toggleScrap } = useToggleScrap(idNum);
  const { mutate: toggleTermSave } = useToggleTermSave(selectedTermId ?? -1);
  const { mutate: readNews } = useReadNews(idNum);

  // 상세 조회 성공 후 열람 처리(/read)를 화면 진입당 딱 1회 호출.
  // useRef 플래그로 StrictMode 이중 실행·리렌더 중복 호출을 막는다.
  const hasReadRef = useRef(false);
  useEffect(() => {
    // newsId가 바뀌면(다른 기사로 진입) 다시 호출할 수 있도록 플래그 리셋
    hasReadRef.current = false;
  }, [idNum]);
  useEffect(() => {
    if (detail && !hasReadRef.current) {
      hasReadRef.current = true;
      readNews();
    }
  }, [detail, readNews]);

  const handleScroll = () => {
    if (!containerRef.current) return;
    setShowScrollBtn(containerRef.current.scrollTop > 300);
  };

  const handleScrollToTop = () => {
    containerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBookmarkClick = () => {
    if (!detail) return;
    toggleScrap(!detail.isScrapped);
  };

  const handleTermSaveClick = () => {
    if (!termData) return;
    toggleTermSave(!termData.isSaved);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-dvh items-center justify-center text-neutral-400">
        불러오는 중…
      </div>
    );
  }

  if (isError || !detail) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-4 text-neutral-500">
        <p>뉴스를 불러오지 못했어요.</p>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="text-primary underline"
        >
          뒤로가기
        </button>
      </div>
    );
  }

  const { positive, negative } = splitImpacts(impactData?.sectorImpacts ?? []);
  const cards = cardData?.cards ?? [];

  return (
    <div className="relative mx-auto flex min-h-dvh w-full max-w-[var(--max-width-app,450px)] flex-col bg-neutral-50 text-black">
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="relative w-full flex-1 overflow-y-auto"
      >
        <div className="relative flex w-full flex-col bg-white">
          {/* 헤더 */}
          <header className="absolute top-[12px] left-0 z-40 flex w-full items-center justify-between bg-transparent px-[20px]">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex h-[28px] w-[28px] shrink-0 items-center justify-center"
              aria-label="뒤로가기"
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 28 28"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 22l-8-8 8-8"
                />
              </svg>
            </button>

            <button
              type="button"
              onClick={handleBookmarkClick}
              className="flex h-[24px] w-[24px] shrink-0 items-center justify-center"
              aria-label="북마크"
            >
              <img
                src={detail.isScrapped ? bookmarkFill : bookmarkLine}
                alt=""
                className="h-full w-full object-contain"
              />
            </button>
          </header>

          {/* 기사 영역 */}
          <div className="relative flex w-full flex-col">
            <div className="relative h-[225px] w-full shrink-0 overflow-hidden bg-neutral-900">
              <div className="absolute inset-0 z-10 bg-black/60" />
              <img
                src={getNewsImage(detail.thumbnailUrl, detail.categoryName)}
                alt=""
                className="relative z-0 h-full w-full object-cover"
                draggable={false}
              />
            </div>

            <div className="absolute top-[122px] left-0 z-20 flex w-full flex-col gap-[8px] px-[20px]">
              <h1 className="text-neutral-0 line-clamp-2 h-[56px] w-full text-[20px] leading-[140%] font-medium">
                {detail.title}
              </h1>

              <div className="flex h-[22px] items-center gap-[8px]">
                <span className="bg-secondary-100 text-primary inline-flex items-center justify-center rounded-[4px] px-[6px] py-[4px] text-[12px] leading-[160%] font-medium">
                  {detail.categoryName}
                </span>
                <span className="flex h-[19px] items-center text-[12px] leading-[160%] font-medium text-neutral-100">
                  {formatRelativeDate(detail.publishedAt)}
                </span>
              </div>
            </div>

            {/* 본문: bodySegments 렌더링 */}
            <div className="flex w-full flex-col gap-[8px] bg-white px-[20px] pt-[24px] pb-[20px]">
              <p className="w-full text-justify text-[16px] leading-[160%] font-normal text-neutral-900">
                {detail.bodySegments.map((seg, i) =>
                  seg.type === "term" && seg.termId != null ? (
                    <span
                      key={i}
                      onClick={() => setSelectedTermId(seg.termId as number)}
                      className="text-primary cursor-pointer font-medium underline underline-offset-2"
                    >
                      {seg.text}
                    </span>
                  ) : (
                    <span key={i}>{seg.text}</span>
                  ),
                )}
              </p>

              {/* 원문 링크 */}
              <a
                href={detail.originalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-[24px] w-full cursor-pointer items-center justify-end"
              >
                <div className="flex h-[24px] items-center gap-[8px]">
                  <div className="flex h-[24px] w-[24px] shrink-0 items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M14 10V14H2V2H6"
                        stroke="var(--color-neutral-400, #999999)"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M10 2H14V6"
                        stroke="var(--color-neutral-400, #999999)"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M6 10L14 2"
                        stroke="var(--color-neutral-400, #999999)"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <span className="flex h-[26px] w-auto text-[16px] leading-[160%] font-medium whitespace-nowrap text-neutral-400">
                    원문 뉴스 보기
                  </span>
                </div>
              </a>
            </div>

            {/* 섹터 영향도 (긍정/부정) */}
            <div className="flex w-full flex-col gap-[8px] bg-white px-[20px] pb-[20px]">
              {positive.length > 0 && (
                <div className="flex w-full flex-col gap-[12px] rounded-[16px] border border-neutral-100 bg-white p-[16px]">
                  <div className="flex h-[26px] items-center gap-[4px] text-[16px] leading-[160%] font-medium text-neutral-900">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M2 13L6 9L9 12L14 6M14 6H10M14 6V10"
                        stroke="#ff3045"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="font-bold text-[#ff3045]">긍정</span>
                    <span>반응이 나타나요!</span>
                  </div>
                  <div className="flex flex-wrap gap-[4px]">
                    {positive.map((s) => (
                      <span
                        key={s.sectorCode}
                        className="flex h-[22px] items-center justify-center rounded-[4px] bg-neutral-50 px-[8px] py-[4px] text-[12px] font-medium text-neutral-400"
                      >
                        {s.sectorName}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {negative.length > 0 && (
                <div className="flex w-full flex-col gap-[12px] rounded-[16px] border border-neutral-100 bg-white p-[16px]">
                  <div className="flex h-[26px] items-center gap-[4px] text-[16px] leading-[160%] font-medium text-neutral-900">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M2 5L6 9L9 6L14 12M14 12H10M14 12V8"
                        stroke="#1289ff"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="font-bold text-[#1289ff]">부정</span>
                    <span>반응이 나타나요!</span>
                  </div>
                  <div className="flex flex-wrap gap-[4px]">
                    {negative.map((s) => (
                      <span
                        key={s.sectorCode}
                        className="flex h-[22px] items-center justify-center rounded-[4px] bg-neutral-50 px-[8px] py-[4px] text-[12px] font-medium text-neutral-400"
                      >
                        {s.sectorName}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 해설 카드 (경제 상식) */}
            {cards.length > 0 && (
              <div className="flex w-full flex-col items-center gap-[16px] bg-white px-[20px] pb-[32px]">
                {cards.map((card) => (
                  <div
                    key={card.cardOrder}
                    className="flex w-full flex-col gap-[16px] rounded-[16px] border border-neutral-100 bg-white p-[20px] shadow-sm"
                  >
                    <div className="flex w-full items-start gap-[4px]">
                      <div className="shrink-0 pt-[1px] text-[16px] leading-[160%] font-bold text-neutral-900">
                        {card.cardOrder}.
                      </div>
                      <h2 className="flex-1 text-left text-[16px] leading-[160%] font-bold text-neutral-900">
                        {card.title}
                      </h2>
                    </div>
                    <div className="flex w-full flex-col gap-4 text-justify text-[16px] leading-[160%] font-normal text-neutral-900">
                      <p>{card.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {showScrollBtn && (
          <div className="pointer-events-none sticky bottom-6 z-50 flex justify-end pr-5">
            <div className="pointer-events-auto">
              <ScrollToTopButton onClick={handleScrollToTop} />
            </div>
          </div>
        )}
      </div>

      {/* 용어 설명 바텀시트 */}
      <BottomSheet
        isOpen={isTermSheetOpen}
        onClose={() => setSelectedTermId(null)}
        ariaLabel="용어 설명"
      >
        <div className="flex flex-col px-[21px] pt-[8px] pb-[32px] text-black">
          <div className="flex w-full items-center justify-between border-b border-neutral-100 py-[8px]">
            <h3 className="text-[20px] leading-[140%] font-bold text-neutral-900">
              <span className="text-primary">{termData?.term}</span>란?
            </h3>

            <button
              type="button"
              onClick={handleTermSaveClick}
              className="flex h-[28px] w-[28px] shrink-0 items-center justify-center"
              aria-label="용어 저장하기"
              disabled={!termData}
            >
              <img
                src={termData?.isSaved ? wordSaveActiveIcon : wordSaveIcon}
                alt={termData?.isSaved ? "용어 저장됨" : "용어 저장하기"}
                className="h-full w-full object-contain"
              />
            </button>
          </div>

          <div className="pt-[16px]">
            <p className="text-[16px] leading-[160%] font-normal text-neutral-900">
              {termData?.content ?? "불러오는 중…"}
            </p>
          </div>
        </div>
      </BottomSheet>
    </div>
  );
}
