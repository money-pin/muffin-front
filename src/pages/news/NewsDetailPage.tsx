import { useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ScrollToTopButton from "./components/ScrollToTopButton";
import BottomSheet from "@/components/common/BottomSheet";
import bookmarkLine from "@/assets/icon-24px/bookmark-line-gray5.svg";
import bookmarkFill from "@/assets/icon-24px/bookmark-fill.svg";
import wordSaveIcon from "@/assets/icon-28px/wordsave.svg";
import wordSaveActiveIcon from "@/assets/icon-28px/wordsave-active.svg";
import { NEWS_DETAIL_MOCK_DATA, type TermDefinition } from "./newsDetailData";

export default function NewsDetailPage() {
  const navigate = useNavigate();
  const { newsId } = useParams<{ newsId: string }>();
  const containerRef = useRef<HTMLDivElement>(null);

  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // 📌 용어 바텀시트 관련 상태
  const [isTermSheetOpen, setIsTermSheetOpen] = useState(false);
  const [selectedTerm, setSelectedTerm] = useState<TermDefinition | null>(null);
  const [isTermSaved, setIsTermSaved] = useState(false);

  const idNum = newsId ? Number(newsId) : 1;
  const newsData = NEWS_DETAIL_MOCK_DATA[idNum] || NEWS_DETAIL_MOCK_DATA[1];

  const handleScroll = () => {
    if (!containerRef.current) return;
    setShowScrollBtn(containerRef.current.scrollTop > 300);
  };

  const handleScrollToTop = () => {
    if (!containerRef.current) return;
    containerRef.current.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // 📌 용어 클릭 시 바텀시트 오픈 핸들러
  const handleTermClick = (termKey: string) => {
    const termInfo = newsData.terms[termKey];
    if (termInfo) {
      setSelectedTerm(termInfo);
      setIsTermSheetOpen(true);
    }
  };

  return (
    <div className="relative mx-auto flex min-h-dvh w-full max-w-[var(--max-width-app,450px)] flex-col bg-neutral-50 text-black">
      {/* 내부 스크롤 영역 */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="relative flex-1 w-full overflow-y-auto"
      >
        <div className="relative flex w-full flex-col bg-white">
          {/* HeaderContent 영역 */}
          <header className="absolute left-0 top-[12px] z-40 flex w-full items-center justify-between bg-transparent px-[20px]">
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
              onClick={() => setIsBookmarked((prev) => !prev)}
              className="flex h-[24px] w-[24px] shrink-0 items-center justify-center"
              aria-label="북마크"
            >
              <img
                src={isBookmarked ? bookmarkFill : bookmarkLine}
                alt=""
                className="h-full w-full object-contain"
              />
            </button>
          </header>

          {/* ArticleContainer 영역 */}
          <div className="relative flex w-full flex-col">
            {/* ArticleImage 영역 */}
            <div className="relative h-[225px] w-full shrink-0 overflow-hidden bg-neutral-900">
              <div className="absolute inset-0 z-10 bg-black/60" />
              <img
                src={newsData.imageUrl}
                alt=""
                className="relative z-0 h-full w-full object-cover"
                draggable={false}
              />
            </div>

            {/* ArticleInfoContainer 영역 */}
            <div className="absolute left-0 top-[122px] z-20 flex w-full flex-col gap-[8px] px-[20px]">
              <h1 className="line-clamp-2 h-[56px] w-full text-[20px] font-medium leading-[140%] text-neutral-0">
                {newsData.title}
              </h1>

              <div className="flex h-[22px] items-center gap-[8px]">
                <span className="inline-flex items-center justify-center rounded-[4px] bg-secondary-100 px-[6px] py-[4px] text-[12px] font-medium leading-[160%] text-primary">
                  {newsData.category}
                </span>
                <span className="flex h-[19px] items-center text-[12px] font-medium leading-[160%] text-neutral-100">
                  {newsData.date}
                </span>
              </div>
            </div>

            {/* ArticleBodyContainer 영역 */}
            <div className="flex w-full flex-col gap-[8px] bg-white px-[20px] pb-[20px] pt-[24px]">
              <div className="w-full text-justify text-[16px] font-normal leading-[160%] text-neutral-900">
                <p className="mb-4">{newsData.body[0]}</p>
                <p>
                  이 열기는 한국의 반도체 ETF에도 영향을 주어, 마치 옆가게도
                  덩달아 손님이 늘어나는 것처럼 함께 상승하고 있어요.{" "}
                  <span
                    onClick={() => handleTermClick("양적완화")}
                    className="cursor-pointer font-medium text-primary underline underline-offset-2"
                  >
                    양적완화
                  </span>
                  가 지속되면 이런 흐름은 더 강해질 수 있답니다.
                </p>
              </div>

              {/* 원문 링크 */}
              <a
                href={newsData.originalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-[24px] w-full cursor-pointer items-center justify-end"
              >
                <div className="flex h-[24px] items-center gap-[8px]">
                  <div className="flex h-[24px] w-[24px] shrink-0 items-center justify-center">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      className="shrink-0"
                    >
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
                  <span className="flex h-[26px] w-auto whitespace-nowrap text-[16px] font-medium leading-[160%] text-neutral-400">
                    원문 뉴스 보기
                  </span>
                </div>
              </a>
            </div>

            {/* CommentsContainer 영역 */}
            <div className="flex w-full flex-col gap-[8px] bg-white px-[20px] pb-[20px]">
              {/* 긍정 반응 */}
              <div className="flex w-full flex-col gap-[12px] rounded-[16px] border border-neutral-100 bg-white p-[16px]">
                <div className="flex h-[26px] items-center gap-[4px] text-[16px] font-medium leading-[160%] text-neutral-900">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    className="shrink-0"
                  >
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
                  {newsData.reactions.positive.map((tag) => (
                    <span
                      key={tag}
                      className="flex h-[22px] items-center justify-center rounded-[4px] bg-neutral-50 px-[8px] py-[4px] text-[12px] font-medium text-neutral-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* 부정 반응 */}
              <div className="flex w-full flex-col gap-[12px] rounded-[16px] border border-neutral-100 bg-white p-[16px]">
                <div className="flex h-[26px] items-center gap-[4px] text-[16px] font-medium leading-[160%] text-neutral-900">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    className="shrink-0"
                  >
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
                  {newsData.reactions.negative.map((tag) => (
                    <span
                      key={tag}
                      className="flex h-[22px] items-center justify-center rounded-[4px] bg-neutral-50 px-[8px] py-[4px] text-[12px] font-medium text-neutral-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* EconomicsContentContainer */}
            <div className="flex w-full flex-col items-center gap-[16px] bg-white px-[20px] pb-[32px]">
              {newsData.knowledgeCards.map((card) => (
                <div
                  key={card.id}
                  className="flex w-full flex-col gap-[16px] rounded-[16px] border border-neutral-100 bg-white p-[20px] shadow-sm"
                >
                  <div className="flex w-full items-start gap-[4px]">
                    <div className="shrink-0 pt-[1px] text-[16px] font-bold leading-[160%] text-neutral-900">
                      {card.id}.
                    </div>
                    <h2 className="flex-1 text-left text-[16px] font-bold leading-[160%] text-neutral-900">
                      {card.title}
                    </h2>
                  </div>

                  <div className="flex w-full flex-col gap-4 text-justify text-[16px] font-normal leading-[160%] text-neutral-900">
                    {card.paragraphs.map((p, pIdx) => (
                      <p key={pIdx}>{p.text}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 📌 [핵심 수정] 스크롤 컨테이너 내부 우측 하단 sticky 플로팅 처리 */}
        {showScrollBtn && (
          <div className="sticky bottom-6 z-50 flex justify-end pr-5 pointer-events-none">
            <div className="pointer-events-auto">
              <ScrollToTopButton onClick={handleScrollToTop} />
            </div>
          </div>
        )}
      </div>

      {/* 📌 용어 설명 바텀시트 */}
      <BottomSheet
        isOpen={isTermSheetOpen}
        onClose={() => setIsTermSheetOpen(false)}
        ariaLabel="용어 설명"
      >
        <div className="flex flex-col px-[21px] pb-[32px] pt-[8px] text-black">
          <div className="flex w-full items-center justify-between border-b border-neutral-100 py-[8px]">
            <h3 className="text-[20px] font-bold leading-[140%] text-neutral-900">
              <span className="text-primary">{selectedTerm?.term}</span>란?
            </h3>

            <button
              type="button"
              onClick={() => setIsTermSaved((prev) => !prev)}
              className="flex h-[28px] w-[28px] shrink-0 items-center justify-center"
              aria-label="용어 저장하기"
            >
              <img
                src={isTermSaved ? wordSaveActiveIcon : wordSaveIcon}
                alt={isTermSaved ? "용어 저장됨" : "용어 저장하기"}
                className="h-full w-full object-contain"
              />
            </button>
          </div>

          <div className="pt-[16px]">
            <p className="text-[16px] font-normal leading-[160%] text-neutral-900">
              {selectedTerm?.definition}
            </p>
          </div>
        </div>
      </BottomSheet>
    </div>
  );
}