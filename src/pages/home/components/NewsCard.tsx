import bookmarkIcon from "@/assets/icon-24px/bookmark-line-white.svg";
import newscardEconomy from "@/assets/newscard/newscard-economy.png";
import newscardIT from "@/assets/newscard/newscard-IT.png";
import newscardWorld from "@/assets/newscard/newscard-world.png";

import type { HomeNews } from "../homeData";

const NEWS_IMAGES = {
  economy: newscardEconomy,
  IT: newscardIT,
  world: newscardWorld,
} as const;

interface NewsCardProps {
  news: HomeNews;
  onClick?: () => void;
  onBookmark?: () => void; // TODO: 뉴스 스크랩 API
}

// Figma MainNewsCard: 이미지(201px, 우상단 북마크) + 제목 2줄 + 카테고리 배지·날짜·조회수
export default function NewsCard({ news, onClick, onBookmark }: NewsCardProps) {
  return (
    <div
      onClick={onClick}
      className="flex w-full cursor-pointer flex-col gap-3 rounded-[12px] border border-neutral-100 bg-white p-5"
    >
      <div className="relative h-[201px] w-full">
        <img
          src={NEWS_IMAGES[news.image]}
          alt=""
          aria-hidden="true"
          className="h-full w-full rounded-[8px] object-cover"
          draggable={false}
        />
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onBookmark?.();
          }}
          aria-label="뉴스 스크랩"
          className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center"
        >
          <img
            src={bookmarkIcon}
            alt=""
            aria-hidden="true"
            className="h-6 w-6"
            draggable={false}
          />
        </button>
      </div>

      <div className="flex flex-col gap-3">
        <p className="line-clamp-2 text-body-16-md-tighter leading-[1.6] text-neutral-900">
          {news.title}
        </p>
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-[22px] min-w-[28px] items-center justify-center rounded-[4px] bg-secondary-100 px-1.5 text-caption-12-md-tighter text-primary">
              {news.category}
            </span>
            <span className="text-caption-12-md-tighter text-neutral-400">
              {news.date}
            </span>
          </div>
          <span className="text-caption-12-md-tighter text-neutral-400">
            조회수 {news.views}회
          </span>
        </div>
      </div>
    </div>
  );
}
