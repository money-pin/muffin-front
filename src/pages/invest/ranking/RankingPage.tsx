import MyRankingSection from "@/pages/invest/ranking/components/MyRankingSection";
import WeeklyRankingSection from "@/pages/invest/ranking/components/WeeklyRankingSection";
import {
  myRankingMock,
  weeklyRankingMock,
} from "@/pages/invest/ranking/mocks/rankingMock";

function RankingPage() {
  return (
    <>
      <div className="flex min-h-full w-full flex-col gap-10 bg-neutral-0 pb-10 pt-6">
        <h1 className="sr-only">모의투자 랭킹</h1>

        <MyRankingSection
          weekLabel={myRankingMock.weekLabel}
          ranking={myRankingMock.myRank}
        />

        <WeeklyRankingSection
          weekLabel={weeklyRankingMock.weekLabel}
          rankings={weeklyRankingMock.top10}
        />
      </div>
    </>
  );
}

export default RankingPage;
