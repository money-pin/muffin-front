import fireIcon from "@/assets/icon-20px/fire.svg";
import calendarIcon from "@/assets/icon-20px/calendar.svg";
import chevronRightIcon from "@/assets/icon-24px/chevron-right.svg";

import PercentageBadge from "./PercentageBadge";
import type { HomeAssets } from "../homeData";

interface AssetCardProps {
  nickname: string;
  streakDays: number;
  assets: HomeAssets;
  onRecentClick?: () => void; // 최근 투자 성과 → 수익 통계 이동
}

// Figma Asset Details: 스트릭 배지(카드 좌측 16px 들여쓰기, 위쪽만 라운드)
// + 총자산 카드(rounded-16, 그림자) + 최근 투자 성과 버튼 행
export default function AssetCard({
  nickname,
  streakDays,
  assets,
  onRecentClick,
}: AssetCardProps) {
  const up = assets.change >= 0;
  const changeText = `${up ? "+" : "-"}${Math.abs(assets.change).toLocaleString()}원`;

  return (
    <div className="flex w-full flex-col">
      <div className="px-4">
        <span className="inline-flex h-7 items-center gap-1 rounded-t-[8px] bg-secondary-100 px-2">
          <img
            src={fireIcon}
            alt=""
            aria-hidden="true"
            className="h-5 w-5"
            draggable={false}
          />
          <span className="text-caption-12-bd text-primary">
            {streakDays}일 연속 학습!
          </span>
        </span>
      </div>

      <div className="flex w-full flex-col gap-3 rounded-[16px] bg-white px-4 pb-4 pt-5 shadow-[0px_1px_3px_rgba(0,0,0,0.15)]">
        <div className="flex flex-col gap-1 px-1">
          <p className="text-caption-12-md-tighter text-neutral-400">
            {nickname}님의 총 자산
          </p>
          <div className="flex w-full items-center justify-between">
            <p className="text-heading-24-md text-neutral-900">
              {assets.total.toLocaleString()}원
            </p>
            <div
              className={`flex items-center gap-2 ${
                up ? "text-positive" : "text-negative"
              }`}
            >
              <span className="text-body-16-bd-tighter">{changeText}</span>
              <PercentageBadge rate={assets.changeRate} />
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onRecentClick}
          className="flex w-full items-center justify-between rounded-[8px] border border-neutral-100 py-[13px] pl-[13px] pr-[17px]"
        >
          <span className="flex items-center gap-2">
            <img
              src={calendarIcon}
              alt=""
              aria-hidden="true"
              className="h-5 w-5"
              draggable={false}
            />
            <span className="text-body-14-bd text-neutral-900">
              최근 투자 성과
            </span>
          </span>
          <span className="flex items-center">
            <span className="flex h-[22px] items-center rounded-[4px] bg-neutral-50 p-1 text-caption-12-md-tighter text-neutral-700">
              {assets.lastInvestedAt.month}월 {assets.lastInvestedAt.day}일
            </span>
            <img
              src={chevronRightIcon}
              alt=""
              aria-hidden="true"
              className="h-6 w-6"
              draggable={false}
            />
          </span>
        </button>
      </div>
    </div>
  );
}
