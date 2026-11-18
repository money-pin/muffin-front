import { useCallback, useEffect, useRef, useState } from "react";

import BottomSheet from "@/components/common/BottomSheet";
import QueryErrorModal from "@/components/common/QueryErrorModal";
import { useWeeklyRankingQuery } from "@/pages/invest/ranking/api/queries";
import MyRankingSection from "@/pages/invest/ranking/components/MyRankingSection";
import RankingUserProfitSheetContent from "@/pages/invest/ranking/components/RankingUserProfitSheetContent";
import WeeklyRankingSection from "@/pages/invest/ranking/components/WeeklyRankingSection";
import type { WeeklyRankingItem } from "@/pages/invest/ranking/types";
import {
  resolveRankingSelection,
  type RankingSelection,
} from "./rankingSelection";

function RankingPage() {
  const [selection, setSelection] = useState<RankingSelection | null>(null);
  const [isProfitSheetOpen, setIsProfitSheetOpen] = useState(false);
  const sheetHistoryPushedRef = useRef(false);
  const weeklyRankingQuery = useWeeklyRankingQuery();

  const rankingData = weeklyRankingQuery.data;
  const isRankingReady = rankingData?.status === "READY";
  const isRankingEmpty = rankingData?.status === "EMPTY";
  const isRankingCalculating = rankingData?.status === "CALCULATING";
  const selectedUser = resolveRankingSelection(rankingData, selection);

  const handleRankingClick = (user: WeeklyRankingItem) => {
    if (!rankingData) return;
    setSelection({ weekKey: rankingData.weekKey, user });
    setIsProfitSheetOpen(true);

    if (!sheetHistoryPushedRef.current) {
      window.history.pushState(
        { ...(window.history.state ?? {}), rankingProfitSheet: true },
        "",
      );
      sheetHistoryPushedRef.current = true;
    }
  };

  const handleProfitSheetClose = useCallback(() => {
    setIsProfitSheetOpen(false);
    if (sheetHistoryPushedRef.current) {
      sheetHistoryPushedRef.current = false;
      window.history.back();
    }
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      if (!sheetHistoryPushedRef.current) return;

      sheetHistoryPushedRef.current = false;
      setIsProfitSheetOpen(false);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    if (!isProfitSheetOpen || selectedUser) return;
    let cancelled = false;
    queueMicrotask(() => {
      if (!cancelled) handleProfitSheetClose();
    });
    return () => {
      cancelled = true;
    };
  }, [handleProfitSheetClose, isProfitSheetOpen, selectedUser]);

  return (
    <>
      <div
        data-invest-ranking
        className="bg-neutral-0 flex min-h-0 w-full flex-1 flex-col gap-10 pt-6"
      >
        <h1 className="sr-only">모의투자 랭킹</h1>

        {weeklyRankingQuery.isLoading && !rankingData && (
          <RankingPageSkeleton />
        )}

        {rankingData && (
          <>
            <MyRankingSection
              weekLabel={rankingData.weekLabel}
              ranking={rankingData.myRank}
              stateMessage={
                isRankingCalculating
                  ? {
                      title: "나의 순위를 집계하고 있어요.",
                      description: "집계가 끝나면 순위를 확인할 수 있어요.",
                    }
                  : undefined
              }
            />

            <WeeklyRankingSection
              weekLabel={rankingData.weekLabel}
              rankings={isRankingReady ? rankingData.top10 : []}
              onRankingClick={handleRankingClick}
              emptyMessage={
                isRankingCalculating
                  ? {
                      title: "지난주 랭킹을 준비하고 있어요",
                      description: "집계가 끝나면 순위를 확인할 수 있어요.",
                    }
                  : isRankingEmpty || rankingData.top10.length === 0
                    ? {
                        title: "아직 표시할 랭킹이 없어요",
                        description:
                          "모의투자에 참여하고 다음 랭킹에 도전해보세요!",
                      }
                    : undefined
              }
            />
          </>
        )}
      </div>

      <QueryErrorModal
        error={weeklyRankingQuery.error}
        errorUpdatedAt={weeklyRankingQuery.errorUpdatedAt}
        isError={weeklyRankingQuery.isError}
        isFetching={weeklyRankingQuery.isFetching}
        hasData={!!rankingData}
        onRetry={() => weeklyRankingQuery.refetch({ cancelRefetch: false })}
      />

      <BottomSheet
        isOpen={isProfitSheetOpen && !!selectedUser}
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

export default RankingPage;
