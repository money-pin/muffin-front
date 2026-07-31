import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import Carousel from "@/components/common/Carousel";
import TabBar from "@/components/common/TabBar";
import Badge from "@/components/common/Badge";
import NewsCard from "./components/NewsCard";
import ScrollToTopButton from "./components/ScrollToTopButton";
import { useTodayNews, useNewsList } from "./newsQueries";
import {
  getNewsImage,
  formatRelativeTime,
} from "@/lib/newsFormat";

import megaphoneIcon from "@/assets/icon-20px/megaphone.svg";

type NewsTabType = "all" | "economy" | "stock" | "world";

const newsTabs = [
  { value: "all", label: "전체" },
  { value: "economy", label: "경제" },
  { value: "stock", label: "증권" },
  { value: "world", label: "세계" },
] as const;

// 탭 → categoryId 매핑 (백엔드 확인 완료: 경제=1, 증권=2, 세계=3).
// 'all'은 categoryId 미전송(전체 조회).
const TAB_CATEGORY_ID: Record<Exclude<NewsTabType, "all">, number> = {
  economy: 1, // 경제
  stock: 2, // 증권
  world: 3, // 세계
};

export default function NewsPage() {
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState<NewsTabType>("all");

  // 따끈한 금융 소식 (오늘의 뉴스)
  const { data: todayData } = useTodayNews();
  const trendingNewsList = todayData?.items ?? [];

  // 오늘의 뉴스 목록 (탭 필터 + 무한스크롤)
  const categoryId =
    currentTab === "all" ? undefined : TAB_CATEGORY_ID[currentTab];
  const {
    data: newsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useNewsList(categoryId);

  const newsItems = newsData?.pages.flatMap((page) => page.items) ?? [];

  // 무한스크롤: 하단 감지 영역이 보이면 다음 페이지 로드
  const { ref: loadMoreRef, inView } = useInView();
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className="relative flex min-h-dvh w-full flex-col bg-[#F5F5F5] pt-5 text-black">
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

        <Carousel>
          {trendingNewsList.map((news) => (
            <div
              key={news.newsId}
              onClick={() => navigate(`/news/${news.newsId}`)}
              className="flex w-full cursor-pointer flex-col gap-4 rounded-[20px] border border-neutral-100 bg-white p-5 shadow-sm"
            >
              <div className="aspect-[16/10] w-full overflow-hidden rounded-[12px]">
                <img
                  src={getNewsImage(news.thumbnailUrl, news.categoryName)}
                  alt=""
                  aria-hidden="true"
                  className="h-full w-full object-cover"
                  draggable={false}
                />
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-[6px]">
                  <Badge>{news.categoryName}</Badge>
                  <span className="shrink-0 text-xs text-neutral-400">
                    {formatRelativeTime(news.publishedAt)}
                  </span>
                </div>
                <h3 className="line-clamp-2 break-keep text-base leading-snug font-bold text-[#1B1B1B]">
                  {news.title}
                </h3>
              </div>
            </div>
          ))}
        </Carousel>
      </section>

      <div className="sticky top-0 z-10 mt-8 w-full bg-[#F5F5F5]">
        <TabBar
          tabs={newsTabs}
          currentTab={currentTab}
          onTabChange={(value) => setCurrentTab(value as NewsTabType)}
        />
      </div>

      <section className="mt-6 flex flex-col gap-[12px] px-5 pb-24">
        <h2 className="text-lg font-bold text-neutral-950">오늘의 뉴스</h2>

        <div className="flex flex-col gap-[12px]">
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

        {/* 무한스크롤 트리거 + 로딩 표시 */}
        {!isLoading && hasNextPage && (
          <div
            ref={loadMoreRef}
            className="flex h-[40px] items-center justify-center text-caption-12-md text-neutral-400"
          >
            {isFetchingNextPage ? "불러오는 중…" : ""}
          </div>
        )}

        {!isLoading && newsItems.length === 0 && (
          <p className="py-10 text-center text-neutral-400">
            표시할 뉴스가 없어요.
          </p>
        )}
      </section>

      <ScrollToTopButton />
    </div>
  );
}
