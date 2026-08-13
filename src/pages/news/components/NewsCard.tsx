import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Badge from "@/components/common/Badge";
import bookmarkFill from "@/assets/icon-24px/bookmark-fill.svg";
import bookmarkLine from "@/assets/icon-24px/bookmark-line-gray5.svg";
import {
  formatCategoryName,
  formatRelativeDate,
  formatViewCount,
  getCategoryFallbackImage,
  getNewsImage,
} from "@/lib/newsFormat";
import { useToggleScrap } from "../newsQueries";

export interface NewsCardProps {
  newsId: number;
  title: string;
  categoryName: string | null;
  publishedAt: string;
  viewCount: number;
  thumbnailUrl?: string | null;
  initialScrapped?: boolean;
}

export default function NewsCard({
  newsId,
  title,
  categoryName,
  publishedAt,
  viewCount,
  thumbnailUrl,
  initialScrapped = false,
}: NewsCardProps) {
  const navigate = useNavigate();
  const [optimisticScrapped, setOptimisticScrapped] = useState<boolean | null>(
    null,
  );
  const [imgSrc, setImgSrc] = useState(() =>
    getNewsImage(thumbnailUrl, categoryName),
  );
  const { mutate: toggleScrap, isPending: isScrapPending } =
    useToggleScrap(newsId);

  const displayCategoryName = formatCategoryName(categoryName);
  const isBookmarked = optimisticScrapped ?? initialScrapped;

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
    <div
      onClick={() => navigate(`/news/${newsId}`)}
      className="bg-neutral-0 flex h-[100px] w-full cursor-pointer items-center gap-4 rounded-[12px] border border-neutral-100 px-3"
    >
      <div className="size-[74px] flex-shrink-0 overflow-hidden rounded-[8px]">
        <img
          src={imgSrc}
          alt=""
          aria-hidden="true"
          className="size-full object-cover"
          draggable={false}
          onError={() => setImgSrc(getCategoryFallbackImage(categoryName))}
        />
      </div>

      <div className="flex min-w-0 flex-1 self-stretch py-[13px]">
        <div className="flex min-w-0 flex-1 flex-col justify-between">
          <div className="flex max-h-10 items-start gap-2">
            <h3 className="text-body-14-md-tighter line-clamp-2 min-w-0 flex-1 leading-[1.35] text-neutral-900">
              {title}
            </h3>
            <button
              type="button"
              onClick={handleBookmarkClick}
              disabled={isScrapPending}
              aria-label={isBookmarked ? "스크랩 해제" : "스크랩"}
              className="flex size-6 flex-shrink-0 items-center justify-center"
            >
              <img
                src={isBookmarked ? bookmarkFill : bookmarkLine}
                alt=""
                aria-hidden="true"
                className="size-full object-contain"
                draggable={false}
              />
            </button>
          </div>

          <div className="flex h-[22px] w-full items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-2">
              <Badge variant="orange">{displayCategoryName}</Badge>
              <span className="text-caption-12-md shrink-0 text-neutral-400">
                {formatRelativeDate(publishedAt)}
              </span>
            </div>

            <span className="text-caption-12-md shrink-0 text-neutral-400">
              조회수 {formatViewCount(viewCount)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
