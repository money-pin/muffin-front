import { useEffect, useRef, useState } from "react";

import BottomSheet from "@/components/common/BottomSheet";
import MyRankingSection from "@/pages/invest/ranking/components/MyRankingSection";
import RankingUserProfitSheetContent from "@/pages/invest/ranking/components/RankingUserProfitSheetContent";
import WeeklyRankingSection from "@/pages/invest/ranking/components/WeeklyRankingSection";
import {
  myRankingMock,
  weeklyRankingMock,
} from "@/pages/invest/ranking/mocks/rankingMock";
import type { WeeklyRankingItem } from "@/pages/invest/ranking/types";

function RankingPage() {
  const [selectedUser, setSelectedUser] = useState<WeeklyRankingItem | null>(
    null,
  );
  const [isProfitSheetOpen, setIsProfitSheetOpen] = useState(false);
  const sheetHistoryPushedRef = useRef(false);

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

        <MyRankingSection
          weekLabel={myRankingMock.weekLabel}
          ranking={myRankingMock.myRank}
        />

        <WeeklyRankingSection
          weekLabel={weeklyRankingMock.weekLabel}
          rankings={weeklyRankingMock.top10}
          onRankingClick={handleRankingClick}
        />
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

export default RankingPage;
