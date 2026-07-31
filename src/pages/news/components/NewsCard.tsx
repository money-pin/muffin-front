import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Badge from "@/components/common/Badge";
import bookmarkLine from "@/assets/icon-24px/bookmark-line-gray5.svg";
import bookmarkFill from "@/assets/icon-24px/bookmark-fill.svg";
import { useToggleScrap } from "../newsQueries";
import {
  getNewsImage,
  getCategoryFallbackImage,
  formatViewCount,
  formatRelativeDate,
} from "@/lib/newsFormat";

export interface NewsCardProps {
  newsId: number;
  title: string;
  categoryName: string;
  publishedAt: string; // ISO date-time
  viewCount: number;
  thumbnailUrl?: string;
  // 목록 응답의 스크랩 여부. 카드 북마크 아이콘 초기 상태로 사용.
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
  const [isBookmarked, setIsBookmarked] = useState(initialScrapped);
  const { mutate: toggleScrap } = useToggleScrap(newsId);

  const [imgSrc, setImgSrc] = useState(() =>
    getNewsImage(thumbnailUrl, categoryName),
  );

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = !isBookmarked;
    setIsBookmarked(next); // 즉시 반영 (mutation 실패 시 아래에서 롤백)
    toggleScrap(next, {
      onError: () => setIsBookmarked(!next),
    });
  };

  return (
    <div
      onClick={() => navigate(`/news/${newsId}`)}
      className="bg-neutral-0 flex w-full cursor-pointer items-center gap-[12px] rounded-[16px] border border-neutral-100 px-[16px] pt-[8px] pb-[16px] shadow-sm"
    >
      <div className="h-[56px] w-[56px] flex-shrink-0 overflow-hidden rounded-[4px]">
        <img
          src={imgSrc}
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover"
          draggable={false}
          onError={() => setImgSrc(getCategoryFallbackImage(categoryName))}
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
            <Badge variant="orange">{categoryName}</Badge>
            <span className="text-caption-12-md text-neutral-400">
              {formatRelativeDate(publishedAt)}
            </span>
          </div>

          <span className="text-caption-12-md text-neutral-400">
            조회수 {formatViewCount(viewCount)}
          </span>
        </div>
      </div>
    </div>
  );
}
