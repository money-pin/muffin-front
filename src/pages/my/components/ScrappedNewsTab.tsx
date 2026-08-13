import { useState } from "react";

import SortDropdown from "@/components/common/SortDropdown";
import { useScrapsQuery } from "@/lib/mypageQueries";
import NewsCard from "@/pages/news/components/NewsCard";
import StorageEmptyState from "./StorageEmptyState";

type SortValue = "recent" | "upload" | "views";

const SORT_OPTIONS = [
  { value: "recent", label: "최근 저장순" },
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

export default function ScrappedNewsTab() {
  const [sortValue, setSortValue] = useState<SortValue>("recent");
  const { data, isLoading, isError } = useScrapsQuery();
  const scraps = data?.items ?? [];

  const sortedScraps = [...scraps].sort((a, b) => {
    if (sortValue === "upload") {
      return (
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
    }
    if (sortValue === "views") {
      return b.viewCount - a.viewCount;
    }
    // recent: 저장 시각 최신순
    return new Date(b.scrappedAt).getTime() - new Date(a.scrappedAt).getTime();
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
        <StorageMessage>스크랩한 뉴스를 불러오는 중이에요.</StorageMessage>
      ) : isError ? (
        <StorageMessage>스크랩한 뉴스를 불러오지 못했어요.</StorageMessage>
      ) : sortedScraps.length === 0 ? (
        <StorageEmptyState
          title="아직 스크랩한 뉴스가 없어요."
          description="뉴스를 스크랩해 보세요."
        />
      ) : (
        <section className="mt-1 flex flex-col gap-3 px-5 pb-10">
          {sortedScraps.map((news) => (
            <NewsCard
              key={news.newsId}
              newsId={news.newsId}
              title={news.title}
              categoryName={news.categoryName}
              publishedAt={news.publishedAt}
              viewCount={news.viewCount}
              thumbnailUrl={news.thumbnailUrl}
              initialScrapped={true}
            />
          ))}
        </section>
      )}
    </div>
  );
}
