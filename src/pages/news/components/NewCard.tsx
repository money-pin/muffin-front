import { useState } from "react";
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

interface NewCardProps {
  title: string;
  category: string;
  date: string;
  views: string;
  imageType: "economy" | "IT" | "world";
}

export default function NewCard({ title, category, date, views, imageType }: NewCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsBookmarked((prev) => !prev);
  };

  return (
    <div className="w-full flex items-center gap-[12px] pt-[8px] pb-[16px] px-[16px] bg-white border border-neutral-100 rounded-[16px] shadow-sm cursor-pointer">
      
      {/* 1. 뉴스 전용 캐릭터 일러스트 자산 영역 (56x56, 곡률 4) */}
      <div className="w-[56px] h-[56px] rounded-[4px] overflow-hidden flex-shrink-0">
        <img
          src={NEWS_IMAGES[imageType]}
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover"
          draggable={false}
        />
      </div>

      {/* 2. 텍스트 정보 및 제어 영역 (Fill 250px) */}
      <div className="flex-1 flex flex-col gap-[6px]">
        
        {/* 상단: 타이틀 & 북마크 */}
        <div className="flex justify-between items-start gap-2">
          <h3 className="line-clamp-2 text-[14px] font-medium text-[#1B1B1B] leading-[160%]">
            {title}
          </h3>
          <button
            type="button"
            onClick={handleBookmarkClick}
            className="w-[24px] h-[24px] flex items-center justify-center flex-shrink-0"
          >
            <img
              src={isBookmarked ? bookmarkFill : bookmarkLine}
              alt="북마크"
              className="w-[13px] h-[18px] object-contain"
            />
          </button>
        </div>

        {/* 하단: 메타 정보 영역 */}
        <div className="flex items-center justify-between w-full h-[22px]">
          <div className="flex items-center gap-[4px]">
            <span className="inline-flex items-center justify-center bg-[#FFF6E8] text-[#F46C0E] px-[6px] py-[4px] rounded-[4px] text-[12px] font-medium leading-[160%]">
              {category}
            </span>
            <span className="text-[12px] font-medium text-[#999999] leading-[160%]">
              {date}
            </span>
          </div>

          <span className="text-[12px] font-medium text-[#999999] leading-[160%]">
            조회수 {views}
          </span>
        </div>

      </div>
    </div>
  );
}