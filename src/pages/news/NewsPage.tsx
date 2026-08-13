import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import Carousel from "@/components/common/Carousel";
import SectionHeader from "@/components/common/SectionHeader";
import TabBar from "@/components/common/TabBar";
import megaphoneIcon from "@/assets/icon-20px/megaphone.svg";
import NewsCard from "./components/NewsCard";
import ScrollToTopButton from "./components/ScrollToTopButton";
import TodayNewsCarouselCard from "./components/TodayNewsCarouselCard";
import NewsPageSkeleton from "./components/NewsPageSkeleton";
import { useNewsList, useTodayNews } from "./newsQueries";
import ErrorModal from "@/components/common/ErrorModal";
import { DEFAULT_ERROR_MESSAGE } from "@/lib/errorMessages";
import { useApiErrorModal } from "@/lib/useApiErrorModal";

type NewsTabType = "all" | "economy" | "stock" | "world";

const newsTabs = [
  { value: "all", label: "전체" },
  { value: "economy", label: "경제" },
  { value: "stock", label: "증권" },
  { value: "world", label: "세계" },
] as const;

const TAB_CATEGORY_ID: Record<Exclude<NewsTabType, "all">, number> = {
  economy: 1,
  stock: 2,
  world: 3,
};

export default function NewsPage() {
  const [currentTab, setCurrentTab] = useState<NewsTabType>("all");

  const {
    data: todayData,
    isLoading: isTodayNewsLoading,
    isError: isTodayNewsError,
    error: todayNewsError,
    refetch: refetchTodayNews,
  } = useTodayNews();
  const todayNewsList = todayData?.items ?? [];
  const hasTodayNews = todayNewsList.length > 0;

  const categoryId =
    currentTab === "all" ? undefined : TAB_CATEGORY_ID[currentTab];
  const {
    data: newsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error: newsListError,
    refetch,
  } = useNewsList(categoryId);

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
        void refetchTodayNews();
      },
    });

  useEffect(() => {
    if (!isError && !isTodayNewsError) return;
    queueMicrotask(() => showError(isError ? newsListError : todayNewsError));
  }, [isError, isTodayNewsError, newsListError, todayNewsError, showError]);

  // 초기 로딩(캐러셀·리스트 첫 조회) 동안 페이지 전체 스켈레톤 노출.
  // 홈/마이페이지와 동일한 "페이지 통째 교체" 패턴.
  if (isTodayNewsLoading || isLoading) {
    return <NewsPageSkeleton />;
  }

  // 조회 실패 시 페이지 대신 네트워크 오류 모달을 노출한다.
  if (isError || isTodayNewsError) {
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
      <section className="flex w-full flex-col gap-3">
        <div className="px-5">
          <SectionHeader
            title="따끈한 금융 소식"
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

        {hasTodayNews ? (
          <Carousel>
            {todayNewsList.map((news) => (
              <TodayNewsCarouselCard key={news.newsId} news={news} />
            ))}
          </Carousel>
        ) : (
          <div className="bg-neutral-0 text-body-14-md mx-5 flex h-[331px] items-center justify-center rounded-[16px] border border-neutral-100 text-neutral-400">
            표시할 금융 소식이 없어요.
          </div>
        )}
      </section>

      <div className="sticky -top-px z-10 mt-4 w-full border-b border-neutral-100 bg-neutral-50">
        <TabBar
          tabs={newsTabs}
          currentTab={currentTab}
          onTabChange={(value) => setCurrentTab(value as NewsTabType)}
          className="bg-neutral-50"
        />
      </div>

      <section className="flex flex-col gap-3 px-5 py-5 pb-24">
        <div className="flex flex-col gap-3">
          {newsItems.map((news) => (
            <NewsCard
              key={news.newsId}
              newsId={news.newsId}
              title={news.title}
              categoryName={news.categoryName}
              publishedAt={news.publishedAt}
              viewCount={news.viewCount}
              thumbnailUrl={news.thumbnailUrl}
              initialScrapped={news.isScrapped}
            />
          ))}
        </div>

        {!isLoading && hasNextPage && (
          <div
            ref={loadMoreRef}
            className="text-caption-12-md flex h-10 items-center justify-center text-neutral-400"
          >
            {isFetchingNextPage ? "불러오는 중..." : ""}
          </div>
        )}

        {!isLoading && newsItems.length === 0 && (
          <p className="py-10 text-center text-neutral-400">
            표시할 뉴스가 없어요.
          </p>
        )}
      </section>

      <ScrollToTopButton className="fixed right-[calc((100vw-min(100vw,var(--max-width-app)))/2+20px)] bottom-[112px] z-40" />
    </div>
  );
}
