import fireIcon from "@/assets/icon-20px/fire.svg";
import calendarIcon from "@/assets/icon-20px/calendar.svg";
import chevronRightIcon from "@/assets/icon-24px/chevron-right.svg";

import type { InvestmentResultDate } from "@/pages/invest/stats/types";
import type { InvestmentAssetResult } from "@/types/invest";
import ProfitRateBadge from "@/pages/invest/components/ProfitRateBadge";
import { getProfitColorClass } from "@/pages/invest/utils/profitFormat";

interface AssetCardProps {
  nickname: string;
  streakDays: number;
  asset?: InvestmentAssetResult;
  recentInvestedAt?: InvestmentResultDate;
  isLoading?: boolean;
  onRecentClick?: () => void;
}

function getSignedValueByDirection(value: number, direction: string) {
  if (direction === "DOWN") return -Math.abs(value);
  if (direction === "UP") return Math.abs(value);

  return value;
}

export default function AssetCard({
  nickname,
  streakDays,
  asset,
  recentInvestedAt,
  isLoading = false,
  onRecentClick,
}: AssetCardProps) {
  const profitAmount =
    asset === undefined
      ? undefined
      : getSignedValueByDirection(
          asset.dailyChangeAmount,
          asset.changeDirection,
        );
  const profitRate =
    asset === undefined
      ? undefined
      : getSignedValueByDirection(asset.dailyChangeRate, asset.changeDirection);
  const shouldShowSkeleton =
    isLoading ||
    asset === undefined ||
    profitAmount === undefined ||
    profitRate === undefined;

  const changeText =
    profitAmount === undefined
      ? ""
      : `${profitAmount > 0 ? "+" : profitAmount < 0 ? "-" : ""}${Math.abs(profitAmount).toLocaleString()}원`;
  const recentInvestedAtText = recentInvestedAt
    ? `${recentInvestedAt.month}월 ${recentInvestedAt.day}일`
    : "이력 없음";

  return (
    <div className="flex w-full flex-col">
      <div className="px-4">
        <span className="bg-secondary-100 inline-flex h-7 items-center gap-1 rounded-t-[8px] px-2">
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

      <div className="flex w-full flex-col gap-3 rounded-[16px] bg-white px-4 pt-5 pb-4 shadow-[0px_1px_3px_rgba(0,0,0,0.15)]">
        <div className="flex flex-col gap-1 px-1">
          <p className="text-caption-12-md-tighter text-neutral-400">
            {nickname}님의 총 자산
          </p>

          {shouldShowSkeleton ? (
            <div className="flex w-full items-center justify-between gap-3">
              <div
                aria-hidden="true"
                className="h-[29px] w-[132px] rounded bg-neutral-100"
              />
              <div
                aria-hidden="true"
                className="h-6 w-[118px] rounded bg-neutral-100"
              />
            </div>
          ) : (
            <div className="flex w-full items-center justify-between">
              <p className="text-heading-24-md text-neutral-900">
                {asset.totalAsset.toLocaleString()}원
              </p>
              <div
                className={`flex items-center gap-2 ${getProfitColorClass(
                  profitAmount,
                )}`}
              >
                <span className="text-body-16-bd-tighter">{changeText}</span>
                <ProfitRateBadge rate={profitRate} />
              </div>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={onRecentClick}
          className="flex w-full items-center justify-between rounded-[8px] border border-neutral-100 py-[13px] pr-[17px] pl-[13px]"
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
            <span className="text-caption-12-md-tighter flex h-[22px] items-center rounded-[4px] bg-neutral-50 p-1 text-neutral-700">
              {recentInvestedAtText}
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
