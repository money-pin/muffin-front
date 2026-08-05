import { useEffect, useRef, useState } from "react";

import BottomSheet from "@/components/common/BottomSheet";
import { useWeeklyRankingQuery } from "@/pages/invest/ranking/api/queries";
import MyRankingSection from "@/pages/invest/ranking/components/MyRankingSection";
import RankingUserProfitSheetContent from "@/pages/invest/ranking/components/RankingUserProfitSheetContent";
import WeeklyRankingSection from "@/pages/invest/ranking/components/WeeklyRankingSection";
import type { WeeklyRankingItem } from "@/pages/invest/ranking/types";

function RankingPage() {
  const [selectedUser, setSelectedUser] = useState<WeeklyRankingItem | null>(
    null,
  );
  const [isProfitSheetOpen, setIsProfitSheetOpen] = useState(false);
  const sheetHistoryPushedRef = useRef(false);
  const weeklyRankingQuery = useWeeklyRankingQuery();

  const rankingData = weeklyRankingQuery.data;
  const isRankingReady = rankingData?.status === "READY";
  const isRankingEmpty = rankingData?.status === "EMPTY";
  const isRankingCalculating = rankingData?.status === "CALCULATING";

  const handleRankingClick = (user: WeeklyRankingItem) => {
    setSelectedUser(user);
    setIsProfitSheetOpen(true);

    if (!sheetHistoryPushedRef.current) {
      window.history.pushState(
        { ...(window.history.state ?? {}), rankingProfitSheet: true },
        "",
      );
      sheetHistoryPushedRef.current = true;
    }
  };

  const handleProfitSheetClose = () => {
    if (sheetHistoryPushedRef.current) {
      window.history.back();
      return;
    }

    setIsProfitSheetOpen(false);
  };

  useEffect(() => {
    const handlePopState = () => {
      if (!sheetHistoryPushedRef.current) return;

      sheetHistoryPushedRef.current = false;
      setIsProfitSheetOpen(false);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  return (
    <>
      <div className="bg-neutral-0 flex min-h-full w-full flex-col gap-10 pt-6">
        <h1 className="sr-only">모의투자 랭킹</h1>

        {weeklyRankingQuery.isLoading && <RankingPageSkeleton />}

        {weeklyRankingQuery.isError && (
          <RankingStateMessage
            message="랭킹 정보를 불러오지 못했어요. 잠시 후 다시 시도해주세요."
            onRetry={() => {
              void weeklyRankingQuery.refetch();
            }}
          />
        )}

        {rankingData && !weeklyRankingQuery.isError && (
          <>
            <MyRankingSection
              weekLabel={rankingData.weekLabel}
              ranking={rankingData.myRank}
            />

            {isRankingReady && rankingData.top10.length > 0 && (
              <WeeklyRankingSection
                weekLabel={rankingData.weekLabel}
                rankings={rankingData.top10}
                onRankingClick={handleRankingClick}
              />
            )}

            {(isRankingEmpty ||
              isRankingCalculating ||
              (isRankingReady && rankingData.top10.length === 0)) && (
              <RankingStateMessage
                message={
                  isRankingCalculating
                    ? "지난주 랭킹을 집계하고 있어요."
                    : "아직 표시할 랭킹 데이터가 없어요."
                }
              />
            )}
          </>
        )}
      </div>

      <BottomSheet
        isOpen={isProfitSheetOpen}
        onClose={handleProfitSheetClose}
        ariaLabel={
          selectedUser
            ? `${selectedUser.nickname}님의 수익 상세`
            : "랭킹 유저 수익 상세"
        }
        snapMode="half-full"
      >
        {selectedUser && <RankingUserProfitSheetContent user={selectedUser} />}
      </BottomSheet>
    </>
  );
}

function RankingPageSkeleton() {
  return (
    <div className="flex flex-col gap-10 px-5">
      <div className="flex flex-col gap-3">
        <div className="h-5 w-40 animate-pulse rounded bg-neutral-100" />
        <div className="h-[58px] animate-pulse rounded-xl bg-neutral-50" />
      </div>
      <div className="flex flex-col gap-3">
        <div className="h-5 w-48 animate-pulse rounded bg-neutral-100" />
        <div className="h-[180px] animate-pulse rounded-xl bg-neutral-50" />
        <div className="h-[260px] animate-pulse rounded-xl bg-neutral-50" />
      </div>
    </div>
  );
}

function RankingStateMessage({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="mx-5 flex min-h-[240px] flex-col items-center justify-center gap-3 rounded-xl bg-neutral-50 px-5 text-center">
      <p className="text-body-14-md text-neutral-600">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="text-body-14-bd text-primary"
        >
          다시 시도
        </button>
      )}
    </div>
  );
}

export default RankingPage;
