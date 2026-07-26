import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Badge from "@/components/common/Badge";
import bookmarkLine from "@/assets/icon-24px/bookmark-line-gray5.svg";
import bookmarkFill from "@/assets/icon-24px/bookmark-fill.svg";

import newscardEconomy from "@/assets/newscard/newscard-economy.png";
import newscardIT from "@/assets/newscard/newscard-IT.png";
import newscardWorld from "@/assets/newscard/newscard-world.png";

const NEWS_IMAGES = {
  economy: newscardEconomy,
  IT: newscardIT,
  world: newscardWorld,
} as const;

export interface NewsCardProps {
  id: number;
  title: string;
  category: string;
  date: string;
  views: string;
  imageType: "economy" | "IT" | "world";
}

export default function NewsCard({
  id,
  title,
  category,
  date,
  views,
  imageType,
}: NewsCardProps) {
  const navigate = useNavigate();
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsBookmarked((prev) => !prev);
  };

  return (
    <div
      onClick={() => navigate(`/news/${id}`)}
      className="bg-neutral-0 flex w-full cursor-pointer items-center gap-[12px] rounded-[16px] border border-neutral-100 px-[16px] pt-[8px] pb-[16px] shadow-sm"
    >
      <div className="h-[56px] w-[56px] flex-shrink-0 overflow-hidden rounded-[4px]">
        <img
          src={NEWS_IMAGES[imageType]}
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover"
          draggable={false}
        />
      </div>

      <div className="flex flex-1 flex-col gap-[6px]">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-body-14-md line-clamp-2 text-neutral-900">
            {title}
          </h3>
          <button
            type="button"
            onClick={handleBookmarkClick}
            className="flex h-[24px] w-[24px] flex-shrink-0 items-center justify-center"
          >
            <img
              src={isBookmarked ? bookmarkFill : bookmarkLine}
              alt="북마크"
              className="h-full w-full object-contain"
            />
          </button>
        </div>

        <div className="flex h-[22px] w-full items-center justify-between">
          <div className="flex items-center gap-[4px]">
            <Badge variant="orange">{category}</Badge>
            <span className="text-caption-12-md text-neutral-400">{date}</span>
          </div>

          <span className="text-caption-12-md text-neutral-400">
            조회수 {views}
          </span>
        </div>
      </div>
    </div>
  );
}
