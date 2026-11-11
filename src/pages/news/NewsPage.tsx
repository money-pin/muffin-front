import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import SectionHeader from "@/components/common/SectionHeader";
import megaphoneIcon from "@/assets/icon-20px/megaphone.svg";
import newsIcon from "@/assets/icon-24px/news-active.svg";
import NewsCard from "./components/NewsCard";
import ScrollToTopButton from "./components/ScrollToTopButton";
import TodayBriefingCard from "./components/TodayBriefingCard";
import NewsPageSkeleton from "./components/NewsPageSkeleton";
import { useNewsList } from "./newsQueries";
import { isBriefingVisible } from "@/lib/briefingApi";
import { useBriefing } from "@/pages/briefing/briefingQueries";
import ErrorModal from "@/components/common/ErrorModal";
import { DEFAULT_ERROR_MESSAGE } from "@/lib/errorMessages";
import { useApiErrorModal } from "@/lib/useApiErrorModal";

export default function NewsPage() {
  // 오늘의 브리핑 (#298). 실패하거나 공개 전이면 카드만 숨기고 뉴스 목록은 그대로 보여준다.
  const { data: briefing } = useBriefing();
  const showBriefing = isBriefingVisible(briefing);

  const {
    data: newsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error: newsListError,
    refetch,
  } = useNewsList();

  const newsItems = newsData?.pages.flatMap((page) => page.items) ?? [];

  const { ref: loadMoreRef, inView } = useInView();
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // 뉴스 조회 실패 시 공용 네트워크 오류 모달(확인/다시 시도)로 안내한다.
  // (뉴스 상세·투자·통계 화면과 동일한 useApiErrorModal + ErrorModal 패턴)
  const { error, showError, closeError, handlePrimaryAction } =
    useApiErrorModal({
      onRetry: () => {
        void refetch();
      },
    });

  useEffect(() => {
    if (!isError) return;
    queueMicrotask(() => showError(newsListError));
  }, [isError, newsListError, showError]);

  // 초기 로딩(리스트 첫 조회) 동안 페이지 전체 스켈레톤 노출.
  // 홈/마이페이지와 동일한 "페이지 통째 교체" 패턴.
  if (isLoading) {
    return <NewsPageSkeleton />;
  }

  // 조회 실패 시 페이지 대신 네트워크 오류 모달을 노출한다.
  if (isError) {
    return (
      <>
        <div className="min-h-dvh w-full bg-neutral-50" />
        <ErrorModal
          isOpen={!!error}
          info={error?.info ?? DEFAULT_ERROR_MESSAGE}
          onPrimaryAction={handlePrimaryAction}
          onSecondaryAction={closeError}
          onClose={closeError}
        />
      </>
    );
  }

  return (
    <div className="relative flex min-h-dvh w-full flex-col bg-neutral-50 pt-5 text-neutral-900">
      {showBriefing && briefing && (
        <section className="flex w-full flex-col gap-2 px-5">
          <div className="px-1">
            <SectionHeader
              title="오늘의 브리핑"
              icon={
                <img
                  src={megaphoneIcon}
                  alt=""
                  aria-hidden="true"
                  className="size-5 shrink-0 object-contain"
                  draggable={false}
                />
              }
            />
          </div>
          <TodayBriefingCard briefing={briefing} />
        </section>
      )}

      {/* 머핀 뉴스 (Figma 런칭 전 수정 > 뉴스: 카테고리 탭 없이 전체 목록) */}
      <section
        className={`flex flex-col gap-2 px-5 pb-24 ${showBriefing ? "mt-8" : ""}`}
      >
        <div className="px-1">
          <SectionHeader
            title="머핀 뉴스"
            icon={
              <img
                src={newsIcon}
                alt=""
                aria-hidden="true"
                className="size-5 shrink-0 object-contain"
                draggable={false}
              />
            }
          />
        </div>

        <div className="flex flex-col gap-2 py-2">
          {newsItems.map((news) => (
            <NewsCard
              key={news.newsId}
              newsId={news.newsId}
              title={news.title}
              categoryName={news.categoryName}
              publishedAt={news.publishedAt}
              viewCount={news.viewCount}
              initialScrapped={news.isScrapped}
            />
          ))}
        </div>

        {hasNextPage && (
          <div
            ref={loadMoreRef}
            className="text-caption-12-md flex h-10 items-center justify-center text-neutral-400"
          >
            {isFetchingNextPage ? "불러오는 중..." : ""}
          </div>
        )}

        {newsItems.length === 0 && (
          <p className="py-10 text-center text-neutral-400">
            표시할 뉴스가 없어요.
          </p>
        )}
      </section>

      <ScrollToTopButton className="fixed right-[calc((100vw-min(100vw,var(--max-width-app)))/2+20px)] bottom-[calc(112px+var(--safe-bottom))] z-40" />
    </div>
  );
}
