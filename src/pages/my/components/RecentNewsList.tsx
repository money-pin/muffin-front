import bookmarkFillIcon from "@/assets/icon-24px/bookmark-fill.svg";
import bookmarkWhiteIcon from "@/assets/icon-24px/bookmark-line-white.svg";
import { useToggleScrap } from "@/pages/news/newsQueries";
import type { MyRecentNews } from "@/pages/my/myData";

interface RecentNewsListProps {
  newsList: MyRecentNews[];
  onNewsClick: (newsId: number) => void;
}

function RecentNewsCard({
  news,
  onNewsClick,
}: {
  news: MyRecentNews;
  onNewsClick: (newsId: number) => void;
}) {
  const { mutate: toggleScrap, isPending } = useToggleScrap(news.id);

  const handleBookmark = () => {
    if (isPending) return;

    toggleScrap(!news.bookmarked);
  };

  return (
    <div className="relative w-[clamp(116px,32.8vw,128px)] shrink-0">
      <button
        type="button"
        onClick={() => onNewsClick(news.id)}
        className="flex w-full flex-col gap-3 text-left"
      >
        <div className="size-[clamp(116px,32.8vw,128px)] overflow-hidden rounded-[16px]">
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
