import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Badge from "@/components/common/Badge";
import bookmarkFill from "@/assets/icon-24px/bookmark-fill.svg";
import bookmarkLineWhite from "@/assets/icon-24px/bookmark-line-white.svg";
import type { NewsListItem } from "@/lib/newsApi";
import {
  formatCategoryName,
  formatRelativeDate,
  formatViewCount,
  getCategoryFallbackImage,
  getNewsImage,
} from "@/lib/newsFormat";
import { useToggleScrap } from "../newsQueries";

interface TodayNewsCarouselCardProps {
  news: NewsListItem;
}

export default function TodayNewsCarouselCard({
  news,
}: TodayNewsCarouselCardProps) {
  const navigate = useNavigate();
  const [optimisticScrapped, setOptimisticScrapped] = useState<boolean | null>(
    null,
  );
  const [imgSrc, setImgSrc] = useState(() =>
    getNewsImage(news.thumbnailUrl, news.categoryName),
  );
  const { mutate: toggleScrap, isPending: isScrapPending } = useToggleScrap(
    news.newsId,
  );

  const isBookmarked = optimisticScrapped ?? news.isScrapped;

  const handleBookmarkClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (isScrapPending) return;

    const next = !isBookmarked;
    setOptimisticScrapped(next);
    toggleScrap(next, {
      onError: () => setOptimisticScrapped(null),
      onSettled: () => setOptimisticScrapped(null),
    });
  };

  return (
    <article
      onClick={() => navigate(`/news/${news.newsId}`)}
      className="bg-neutral-0 flex w-full cursor-pointer flex-col overflow-hidden rounded-[16px] border border-neutral-100 p-5"
    >
      <div className="relative h-[201px] w-full overflow-hidden rounded-[8px] bg-neutral-700">
        <img
          src={imgSrc}
          alt=""
          aria-hidden="true"
          className="size-full object-cover"
          draggable={false}
          onError={() => setImgSrc(getCategoryFallbackImage(news.categoryName))}
        />
        <button
          type="button"
          onClick={handleBookmarkClick}
          disabled={isScrapPending}
          aria-label={isBookmarked ? "북마크 해제" : "북마크"}
          className="absolute top-2 right-2 flex size-6 items-center justify-center disabled:opacity-60"
        >
          <img
            src={isBookmarked ? bookmarkFill : bookmarkLineWhite}
            alt=""
            aria-hidden="true"
            className="size-6 object-contain"
            draggable={false}
          />
        </button>
      </div>

      <div className="mt-3 flex flex-col gap-3">
        <h3 className="text-body-16-md-tighter line-clamp-2 min-h-[44px] break-keep text-neutral-900">
          {news.title}
        </h3>

        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <Badge>{formatCategoryName(news.categoryName)}</Badge>
            <span className="text-caption-12-md-tighter shrink-0 text-neutral-400">
              {formatRelativeDate(news.publishedAt)}
            </span>
          </div>

          <span className="text-caption-12-md-tighter shrink-0 text-neutral-400">
            조회수 {formatViewCount(news.viewCount)}
          </span>
        </div>
      </div>
    </article>
  );
}
