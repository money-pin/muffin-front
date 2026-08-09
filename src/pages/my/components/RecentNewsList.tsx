import { useQueryClient } from "@tanstack/react-query";

import bookmarkFillIcon from "@/assets/icon-24px/bookmark-fill.svg";
import bookmarkWhiteIcon from "@/assets/icon-24px/bookmark-line-white.svg";
import type { MyHome } from "@/lib/mypageApi";
import { mypageQueryKeys } from "@/lib/mypageQueries";
import { useToggleScrap } from "@/pages/news/newsQueries";
import type { MyRecentNews } from "@/pages/my/myData";

interface RecentNewsListProps {
  newsList: MyRecentNews[];
  onNewsClick: (newsId: number) => void;
}

function setHomeScrap(
  queryClient: ReturnType<typeof useQueryClient>,
  newsId: number,
  isScrapped: boolean,
) {
  queryClient.setQueryData<MyHome>(mypageQueryKeys.home(), (old) =>
    old
      ? {
          ...old,
          recentNews: old.recentNews?.map((news) =>
            news.newsId === newsId ? { ...news, isScrapped } : news,
          ),
        }
      : old,
  );
}

function RecentNewsCard({
  news,
  onNewsClick,
}: {
  news: MyRecentNews;
  onNewsClick: (newsId: number) => void;
}) {
  const queryClient = useQueryClient();
  const { mutate: toggleScrap, isPending } = useToggleScrap(news.id);

  const handleBookmark = () => {
    if (isPending) return;

    const next = !news.bookmarked;
    setHomeScrap(queryClient, news.id, next);
    toggleScrap(next, {
      onError: () => setHomeScrap(queryClient, news.id, !next),
    });
  };

  return (
    <div className="relative w-32 shrink-0">
      <button
        type="button"
        onClick={() => onNewsClick(news.id)}
        className="flex w-full flex-col gap-3 text-left"
      >
        <div className="size-32 overflow-hidden rounded-[16px]">
          <img
            src={news.image}
            alt=""
            className="h-full w-full object-cover"
            draggable={false}
          />
        </div>
        <p className="text-body-14-md-tighter line-clamp-2 break-keep text-neutral-700">
          {news.title}
        </p>
      </button>

      <button
        type="button"
        onClick={handleBookmark}
        disabled={isPending}
        aria-label={news.bookmarked ? "스크랩 해제" : "스크랩"}
        aria-pressed={news.bookmarked}
        className="absolute top-2 right-2 flex size-6 items-center justify-center disabled:opacity-60"
      >
        <img
          src={news.bookmarked ? bookmarkFillIcon : bookmarkWhiteIcon}
          alt=""
          aria-hidden="true"
          className="size-6"
          draggable={false}
        />
      </button>
    </div>
  );
}

export default function RecentNewsList({
  newsList,
  onNewsClick,
}: RecentNewsListProps) {
  return (
    <div className="-mx-5 flex [scrollbar-width:none] gap-2 overflow-x-auto px-5 [&::-webkit-scrollbar]:hidden">
      {newsList.map((news) => (
        <RecentNewsCard key={news.id} news={news} onNewsClick={onNewsClick} />
      ))}
    </div>
  );
}
