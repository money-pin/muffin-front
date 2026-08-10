import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BottomSheet from "@/components/common/BottomSheet";
import Badge from "@/components/common/Badge";
import ErrorModal from "@/components/common/ErrorModal";
import bookmarkFill from "@/assets/icon-24px/bookmark-fill.svg";
import bookmarkLineWhite from "@/assets/icon-24px/bookmark-line-white.svg";
import newsImpactNegativeIcon from "@/assets/icon-16px/news-impact-negative.svg";
import newsImpactPositiveIcon from "@/assets/icon-16px/news-impact-positive.svg";
import chevronLeftIcon from "@/assets/icon-28px/chevron-left.svg";
import wordSaveActiveIcon from "@/assets/icon-28px/wordsave-active.svg";
import wordSaveIcon from "@/assets/icon-28px/wordsave.svg";
import { ApiError } from "@/lib/api";
import { DEFAULT_ERROR_MESSAGE } from "@/lib/errorMessages";
import { useApiErrorModal } from "@/lib/useApiErrorModal";
import type { SectorImpactItem } from "@/lib/newsApi";
import {
  formatCategoryName,
  formatRelativeDate,
  getNewsImage,
} from "@/lib/newsFormat";
import NewsDetailPageSkeleton from "./components/NewsDetailPageSkeleton";
import ScrollToTopButton from "./components/ScrollToTopButton";
import TermBottomSheetSkeleton from "./components/TermBottomSheetSkeleton";
import Toast from "./components/Toast";
import {
  useExplanationCards,
  useNewsDetail,
  useReadNews,
  useSectorImpacts,
  useTerm,
  useToggleScrap,
  useToggleTermSave,
  useUnsaveTermById,
} from "./newsQueries";

function splitImpacts(impacts: SectorImpactItem[]) {
  const positive = impacts.filter((sector) => sector.impact === "POSITIVE");
  const negative = impacts.filter((sector) => sector.impact === "NEGATIVE");
  return { positive, negative };
}

// 마지막 글자의 받침 유무로 "이란?"/"란?" 선택.
// 한글 음절(가~힣) 받침은 (코드 - 0xAC00) % 28 != 0 이면 존재.
function getTermSuffix(term: string) {
  const lastChar = term.at(-1);
  if (!lastChar) return "란?";

  const code = lastChar.charCodeAt(0);
  const isHangul = code >= 0xac00 && code <= 0xd7a3;
  if (!isHangul) return "란?";

  const hasFinalConsonant = (code - 0xac00) % 28 !== 0;
  return hasFinalConsonant ? "이란?" : "란?";
}

function renderMarkdownBold(content: string) {
  const parts = content.split(/(\*\*[^*]+\*\*)/g);

  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index} className="font-bold text-neutral-700">
          {part.slice(2, -2)}
        </strong>
      );
    }

    return <span key={index}>{part}</span>;
  });
}

interface ImpactCardProps {
  type: "positive" | "negative";
  sectors: SectorImpactItem[];
}

function ImpactCard({ type, sectors }: ImpactCardProps) {
  const isPositive = type === "positive";
  const iconSrc = isPositive ? newsImpactPositiveIcon : newsImpactNegativeIcon;

  return (
    <section className="bg-neutral-0 flex w-full flex-col gap-3 rounded-[12px] border border-neutral-100 p-4">
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

      <div className="flex flex-wrap gap-2">
        {sectors.map((sector) => (
          <span
            key={sector.sectorCode}
            className="text-caption-12-md-tighter flex h-[22px] items-center rounded-[4px] bg-neutral-50 px-2 text-neutral-700"
          >
            {sector.sectorName}
          </span>
        ))}
      </div>
    </section>
  );
}

export default function NewsDetailPage() {
  const navigate = useNavigate();
  const { newsId } = useParams<{ newsId: string }>();
  const idNum = newsId ? Number(newsId) : NaN;
  const containerRef = useRef<HTMLDivElement>(null);
  const hasReadRef = useRef(false);

  const [selectedTermId, setSelectedTermId] = useState<number | null>(null);
  const isTermSheetOpen = selectedTermId != null;

  // 용어 저장 완료 토스트. undoTermId를 들고 있어 "취소" 시 해당 용어를 해제한다.
  // id는 연속 저장 시 토스트를 새로 띄우기 위한 키.
  const [savedToast, setSavedToast] = useState<{
    id: number;
    undoTermId: number;
  } | null>(null);
  const toastIdRef = useRef(0);

  const {
    data: detail,
    error: detailError,
    isLoading,
    isError,
    isFetching,
    refetch: refetchDetail,
  } = useNewsDetail(idNum);
  const { data: impactData } = useSectorImpacts(idNum);
  const {
    data: cardData,
    isError: isCardError,
    error: cardError,
  } = useExplanationCards(idNum);
  const {
    data: termData,
    isError: isTermError,
    error: termError,
  } = useTerm(selectedTermId);

  const { mutate: toggleScrap, isPending: isScrapPending } =
    useToggleScrap(idNum);
  const { mutate: toggleTermSave, isPending: isTermSavePending } =
    useToggleTermSave(selectedTermId ?? -1);
  const { mutate: undoTermSave } = useUnsaveTermById();
  const { mutate: readNews } = useReadNews(idNum);

  // 뉴스 상세 전체 로드 실패 시 에러 모달. 코드별 문구/액션은 공용 레이어가
  // 결정(404·403은 돌아가기/닫기, 그 외는 다시 시도). 다시 시도는 refetch 연결.
  const {
    error: detailModalError,
    showError: showDetailError,
    closeError: closeDetailError,
    handlePrimaryAction: handleDetailModalAction,
  } = useApiErrorModal({
    onRetry: () => {
      void refetchDetail();
    },
  });

  useEffect(() => {
    if (!isError) return;
    queueMicrotask(() => {
      showDetailError(detailError);
    });
  }, [isError, detailError, showDetailError]);

  useEffect(() => {
    hasReadRef.current = false;
  }, [idNum]);

  useEffect(() => {
    if (detail && !hasReadRef.current) {
      hasReadRef.current = true;
      readNews();
    }
  }, [detail, readNews]);

  useEffect(() => {
    if (
      selectedTermId != null &&
      termError instanceof ApiError &&
      termError.code === "CONTENT_404_002"
    ) {
      console.error(termError);
      queueMicrotask(() => {
        setSelectedTermId(null);
      });
    }
  }, [selectedTermId, termError]);

  const handleScrollToTop = () => {
    containerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBookmarkClick = () => {
    if (!detail || isScrapPending) return;
    toggleScrap(!detail.isScrapped);
  };

  const handleTermSaveClick = () => {
    if (!termData || isTermSavePending || selectedTermId == null) return;

    const nextSaved = !termData.isSaved;
    // 토스트의 "취소"는 잠시 뒤에 눌릴 수 있고 그 사이 바텀시트가 닫혀
    // selectedTermId가 바뀔 수 있으므로, 저장 시점의 termId를 캡처해 둔다.
    const savedTermId = selectedTermId;

    toggleTermSave(nextSaved, {
      // 저장(false→true)에 성공했을 때만 토스트 노출. 해제는 조용히 처리.
      onSuccess: () => {
        if (!nextSaved) return;
        setSavedToast({ id: ++toastIdRef.current, undoTermId: savedTermId });
      },
    });
  };

  if (isLoading) {
    return <NewsDetailPageSkeleton />;
  }

  if (isError || !detail) {
    return (
      <>
        <div className="min-h-dvh w-full max-w-[var(--max-width-app)] bg-neutral-50" />
        <ErrorModal
          isOpen={!!detailModalError}
          info={detailModalError?.info ?? DEFAULT_ERROR_MESSAGE}
          onPrimaryAction={handleDetailModalAction}
          onSecondaryAction={closeDetailError}
          onClose={closeDetailError}
          isLoading={isFetching}
        />
      </>
    );
  }

  const { positive, negative } = splitImpacts(impactData?.sectorImpacts ?? []);
  const cards = cardData?.cards ?? [];
  const displayCategoryName = formatCategoryName(detail.categoryName);
  const isExplanationPending =
    cardError instanceof ApiError && cardError.code === "CONTENT_409_001";

  return (
    <div className="relative mx-auto flex min-h-dvh w-full max-w-[var(--max-width-app)] flex-col bg-neutral-50 text-neutral-900">
      <div
        ref={containerRef}
        className="relative w-full flex-1 overflow-y-auto"
      >
        <article className="bg-neutral-0 flex w-full flex-col">
          <div className="relative h-[225px] w-full shrink-0 overflow-hidden bg-neutral-900">
            <img
              src={getNewsImage(detail.thumbnailUrl, detail.categoryName)}
              alt=""
              aria-hidden="true"
              className="h-full w-full object-cover opacity-55"
              draggable={false}
            />

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

              <button
                type="button"
                onClick={handleBookmarkClick}
                disabled={isScrapPending}
                aria-label={detail.isScrapped ? "북마크 해제" : "북마크"}
              >
                <img
                  src={detail.isScrapped ? bookmarkFill : bookmarkLineWhite}
                  alt=""
                  aria-hidden="true"
                  className="size-6 object-contain"
                  draggable={false}
                />
              </button>
            </header>

            <div className="absolute bottom-5 left-0 z-10 flex w-full flex-col gap-2 px-5">
              <h1 className="text-heading-20-md text-neutral-0 line-clamp-2">
                {detail.title}
              </h1>

              <div className="flex items-center gap-2">
                <Badge>{displayCategoryName}</Badge>
                <span className="text-caption-12-md-tighter text-neutral-100">
                  {formatRelativeDate(detail.publishedAt)}
                </span>
              </div>
            </div>
          </div>

          <section className="flex w-full flex-col gap-1 px-5 pt-6 pb-5">
            <p className="text-body-16-rg-tighter whitespace-pre-wrap text-neutral-900">
              {detail.bodySegments.map((segment, index) =>
                segment.type === "HIGHLIGHT" && segment.termId != null ? (
                  <button
                    key={`${segment.termId}-${index}`}
                    type="button"
                    onClick={() => setSelectedTermId(segment.termId as number)}
                    className="text-primary inline cursor-pointer underline underline-offset-2"
                  >
                    {segment.text}
                  </button>
                ) : (
                  <span key={index}>{segment.text}</span>
                ),
              )}
            </p>

            <a
              href={detail.originalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-body-16-md-tighter ml-auto flex h-[45px] items-center gap-2 rounded-[8px] pr-4 text-neutral-400"
            >
              <span aria-hidden="true" className="text-[20px] leading-none">
                ↗
              </span>
              원문 뉴스 보기
            </a>

            {(positive.length > 0 || negative.length > 0) && (
              <div className="flex flex-col gap-2 pt-1">
                {positive.length > 0 && (
                  <ImpactCard type="positive" sectors={positive} />
                )}
                {negative.length > 0 && (
                  <ImpactCard type="negative" sectors={negative} />
                )}
              </div>
            )}
          </section>
        </article>

        {cards.length > 0 ? (
          <section className="flex w-full flex-col gap-3 bg-neutral-50/80 px-5 pt-5 pb-10">
            {cards.map((card) => (
              <div
                key={card.cardOrder}
                className="bg-neutral-0 flex w-full flex-col gap-4 rounded-[16px] p-5 shadow-[0_0_2px_rgba(0,0,0,0.08)]"
              >
                <div className="flex items-start gap-1">
                  <span className="text-body-16-bd-tighter shrink-0 text-neutral-900">
                    {card.cardOrder}.
                  </span>
                  <h2 className="text-body-16-bd-tighter min-w-0 flex-1 text-neutral-900">
                    {card.title}
                  </h2>
                </div>
                <p className="text-body-16-rg-tighter whitespace-pre-wrap text-neutral-700">
                  {renderMarkdownBold(card.content)}
                </p>
              </div>
            ))}
          </section>
        ) : isCardError ? (
          <section className="bg-neutral-50 px-5 py-6 pb-10">
            <p className="text-body-14-md bg-neutral-0 rounded-[16px] px-5 py-8 text-center text-neutral-400">
              {isExplanationPending
                ? "아직 해설 카드를 준비 중이에요."
                : "경제 상식 정보를 불러오지 못했어요."}
            </p>
          </section>
        ) : null}
      </div>

      <ScrollToTopButton
        onClick={handleScrollToTop}
        className="fixed right-[calc((100vw-min(100vw,var(--max-width-app)))/2+20px)] bottom-6 z-40"
      />

      <BottomSheet
        isOpen={isTermSheetOpen}
        onClose={() => setSelectedTermId(null)}
        ariaLabel="용어 설명"
      >
        {!isTermError && !termData ? (
          <TermBottomSheetSkeleton />
        ) : (
          <div className="flex min-h-full flex-col px-5 pt-2 pb-8 text-neutral-900">
            <div className="flex w-full items-center justify-between border-b border-neutral-100 py-2">
              <h3 className="text-heading-20-bd min-w-0 flex-1">
                <span className="text-primary">{termData?.term ?? "용어"}</span>
                {getTermSuffix(termData?.term ?? "용어")}
              </h3>

              <button
                type="button"
                onClick={handleTermSaveClick}
                className="flex size-7 shrink-0 items-center justify-center"
                aria-label="용어 저장하기"
                disabled={!termData || isTermSavePending}
              >
                <img
                  src={termData?.isSaved ? wordSaveActiveIcon : wordSaveIcon}
                  alt=""
                  aria-hidden="true"
                  className="size-7 object-contain"
                  draggable={false}
                />
              </button>
            </div>

            <div className="pt-4">
              <p className="text-body-16-rg-tighter break-keep whitespace-pre-wrap text-neutral-900">
                {isTermError
                  ? "용어를 불러오지 못했습니다."
                  : termData?.content}
              </p>
            </div>
          </div>
        )}
      </BottomSheet>

      {savedToast && (
        <Toast
          key={savedToast.id}
          message="용어가 저장되었어요!"
          actionLabel="취소"
          onAction={() => undoTermSave(savedToast.undoTermId)}
          onClose={() => setSavedToast(null)}
        />
      )}
    </div>
  );
}
