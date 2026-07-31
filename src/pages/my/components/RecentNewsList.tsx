import bookmarkFillIcon from "@/assets/icon-24px/bookmark-fill.svg";
import bookmarkWhiteIcon from "@/assets/icon-24px/bookmark-line-white.svg";
import type { MyRecentNews } from "@/pages/my/myData";

interface RecentNewsListProps {
  newsList: MyRecentNews[];
  onNewsClick: (newsId: number) => void;
}

// Figma 최근 읽은 뉴스: 가로 스크롤 카드(이미지 + 북마크 오버레이 + 제목 2줄)
export default function RecentNewsList({
  newsList,
  onNewsClick,
}: RecentNewsListProps) {
  return (
    <div className="-mx-5 flex [scrollbar-width:none] gap-3 overflow-x-auto px-5 [&::-webkit-scrollbar]:hidden">
      {newsList.map((news) => (
        <button
          key={news.id}
          type="button"
          onClick={() => onNewsClick(news.id)}
          className="flex w-[130px] shrink-0 flex-col gap-2 text-left"
        >
          <div className="relative h-[130px] w-[130px] overflow-hidden rounded-[12px]">
            <img
              src={news.image}
              alt=""
              className="h-full w-full object-cover"
              draggable={false}
            />
            <img
              src={news.bookmarked ? bookmarkFillIcon : bookmarkWhiteIcon}
              alt={news.bookmarked ? "북마크됨" : ""}
              className="absolute top-2 right-2 h-6 w-6"
              draggable={false}
            />
          </div>
          <p className="text-body-14-md line-clamp-2 break-keep text-neutral-900">
            {news.title}
          </p>
        </button>
      ))}
    </div>
  );
}
