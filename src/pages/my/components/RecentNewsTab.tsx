import { useState } from "react";

import SortDropdown from "@/components/common/SortDropdown";
import { useRecentNewsQuery } from "@/lib/mypageQueries";
import NewsCard from "@/pages/news/components/NewsCard";

type SortValue = "recent" | "upload" | "views";

const SORT_OPTIONS = [
  { value: "recent", label: "최근 열람순" },
  { value: "upload", label: "업로드순" },
  { value: "views", label: "조회수순" },
] as const;

function StorageMessage({ children }: { children: string }) {
  return (
    <p className="text-body-14-md px-5 py-16 text-center text-neutral-400">
      {children}
    </p>
  );
}

export default function RecentNewsTab() {
  const [sortValue, setSortValue] = useState<SortValue>("recent");
  const { data, isLoading, isError } = useRecentNewsQuery();
  const newsList = data?.items ?? [];

  const sortedNews = [...newsList].sort((a, b) => {
    if (sortValue === "upload") {
      return (
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
    }
    if (sortValue === "views") {
      return b.viewCount - a.viewCount;
    }
    // recent: 열람 시각 최신순
    return new Date(b.viewedAt).getTime() - new Date(a.viewedAt).getTime();
  });

  return (
    <div className="flex w-full flex-col">
      <div className="flex w-full justify-end px-5 py-2">
        <SortDropdown
          options={SORT_OPTIONS}
          value={sortValue}
          onChange={(val) => setSortValue(val as SortValue)}
          align="end"
        />
      </div>

      {isLoading ? (
        <StorageMessage>최근 읽은 뉴스를 불러오는 중이에요.</StorageMessage>
      ) : isError ? (
        <StorageMessage>최근 읽은 뉴스를 불러오지 못했어요.</StorageMessage>
      ) : sortedNews.length === 0 ? (
        <StorageMessage>최근 읽은 뉴스가 없어요.</StorageMessage>
      ) : (
        <section className="mt-1 flex flex-col gap-3 px-5 pb-10">
          {sortedNews.map((news) => (
            <NewsCard
              key={news.newsId}
              newsId={news.newsId}
              title={news.title}
              categoryName={news.categoryName}
              publishedAt={news.publishedAt}
              viewCount={news.viewCount}
              thumbnailUrl={news.thumbnailUrl}
            />
          ))}
        </section>
      )}
    </div>
  );
}
