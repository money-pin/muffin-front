import { useRecentNewsQuery } from "@/lib/mypageQueries";
import NewsCard from "@/pages/news/components/NewsCard";
import StorageEmptyState from "./StorageEmptyState";

function StorageMessage({ children }: { children: string }) {
  return (
    <p className="text-body-14-md px-5 py-16 text-center text-neutral-400">
      {children}
    </p>
  );
}

export default function RecentNewsTab() {
  const { data, isLoading, isError } = useRecentNewsQuery();
  const newsList = data?.items ?? [];

  return (
    <div className="flex w-full flex-col">
      {isLoading ? (
        <StorageMessage>최근 읽은 뉴스를 불러오는 중이에요.</StorageMessage>
      ) : isError ? (
        <StorageMessage>최근 읽은 뉴스를 불러오지 못했어요.</StorageMessage>
      ) : newsList.length === 0 ? (
        <StorageEmptyState
          title="아직 읽은 뉴스가 없어요."
          description="관심 있는 뉴스를 읽어보세요."
        />
      ) : (
        <section className="flex flex-col gap-3 px-5 pt-3 pb-10">
          {newsList.map((news) => (
            <NewsCard
              key={news.newsId}
              newsId={news.newsId}
              title={news.title}
              categoryName={news.categoryName}
              publishedAt={news.publishedAt}
              viewCount={news.viewCount}
              thumbnailUrl={news.thumbnailUrl}
              initialScrapped={news.isScrapped ?? false}
            />
          ))}
        </section>
      )}
    </div>
  );
}
