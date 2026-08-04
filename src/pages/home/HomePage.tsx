import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Logo from "@/components/common/Logo";
import Carousel from "@/components/common/Carousel";
import SectionHeader from "@/components/common/SectionHeader";
import megaphoneIcon from "@/assets/icon-20px/megaphone.svg";
import rankingIcon from "@/assets/icon-20px/ranking.svg";
import BottomSheet from "@/components/common/BottomSheet";
import RecentPerformanceSheetContent from "@/pages/invest/stats/components/RecentPerformanceSheetContent";
import { statsMock } from "@/pages/invest/stats/mocks/statsMock";
import { useStatsSummaryQuery } from "@/pages/invest/stats/api/queries";
import { useInvestmentAssetQuery } from "@/pages/invest/investmentAssetQueries";
import { useMyHomeQuery } from "@/lib/mypageQueries";
import { characterTypeToVariant } from "@/lib/character";
import TodayNewsCarouselCard from "@/pages/news/components/TodayNewsCarouselCard";
import { useTodayNews } from "@/pages/news/newsQueries";

import CharacterGreeting from "./components/CharacterGreeting";
import HomePageSkeleton from "./components/HomePageSkeleton";
import AssetCard from "./components/AssetCard";
import QuizBanner from "./components/QuizBanner";
import TopSectorList from "./components/TopSectorList";
import InvestResultSheet from "./components/InvestResultSheet";
import { HOME_USER, HOME_TOP_SECTORS, HOME_INVEST_RESULT } from "./homeData";

const INVEST_RESULT_SEEN_KEY = "muffin:investResultSeenDate";

function HomePage() {
  const navigate = useNavigate();
  const [recentPerformanceOpen, setRecentPerformanceOpen] = useState(false);

  const myHomeQuery = useMyHomeQuery();
  const nickname = myHomeQuery.data?.nickname ?? "";
  // 캐릭터는 마이페이지와 동일하게 서버값을 사용 (localStorage 불일치 방지)
  const characterVariant = myHomeQuery.data?.character
    ? characterTypeToVariant(myHomeQuery.data.character.characterType)
    : "plain";

  const investmentAssetQuery = useInvestmentAssetQuery();
  const statsSummaryQuery = useStatsSummaryQuery();
  const todayNewsQuery = useTodayNews();

  const todayNewsList = todayNewsQuery.data?.items ?? [];

  const [investResultOpen, setInvestResultOpen] = useState(
    () =>
      new Date().getHours() >= 10 &&
      localStorage.getItem(INVEST_RESULT_SEEN_KEY) !== HOME_INVEST_RESULT.date,
  );

  useEffect(() => {
    if (investResultOpen) {
      localStorage.setItem(INVEST_RESULT_SEEN_KEY, HOME_INVEST_RESULT.date);
    }
  }, [investResultOpen]);

  if (investmentAssetQuery.isLoading || myHomeQuery.isLoading) {
    return <HomePageSkeleton />;
  }

  return (
    <div className="flex min-h-full flex-col bg-[linear-gradient(180deg,rgba(255,255,255,0.2)_23.6%,rgba(255,194,102,0.2)_36.4%),linear-gradient(#fff,#fff)]">
      <header className="flex h-[52px] shrink-0 items-center px-5">
        <Logo size="xs" />
      </header>

      <div className="flex flex-col px-5 pt-4">
        <CharacterGreeting
          message={HOME_USER.message}
          variant={characterVariant}
        />
      </div>

      <div className="mt-1 px-5">
        <AssetCard
          nickname={nickname}
          streakDays={HOME_USER.streakDays}
          asset={investmentAssetQuery.data}
          recentInvestedAt={statsSummaryQuery.data?.investDate}
          isLoading={
            investmentAssetQuery.isLoading || investmentAssetQuery.isError
          }
          onRecentClick={() => setRecentPerformanceOpen(true)}
        />
      </div>

      <BottomSheet
        isOpen={recentPerformanceOpen}
        onClose={() => setRecentPerformanceOpen(false)}
        ariaLabel="최근 투자 성과 상세"
        snapMode="half-full"
      >
        <RecentPerformanceSheetContent
          summary={statsMock.recentPerformance}
          sectors={statsMock.sectorDetails}
        />
      </BottomSheet>

      <InvestResultSheet
        isOpen={investResultOpen}
        onClose={() => setInvestResultOpen(false)}
        result={HOME_INVEST_RESULT}
        onDetailClick={() => navigate("/invest/stats")}
        onInvestClick={() => navigate("/invest")}
      />

      <div className="mt-7 flex flex-1 flex-col gap-9 rounded-t-[24px] bg-white pt-6 pb-9 shadow-[0px_-3px_7px_rgba(0,0,0,0.1)]">
        <div className="px-5">
          <QuizBanner onClick={() => navigate("/quiz")} />
        </div>

        <section className="flex flex-col gap-2">
          <div className="px-6">
            <SectionHeader
              title="따끈한 금융 소식"
              icon={
                <img
                  src={megaphoneIcon}
                  alt=""
                  aria-hidden="true"
                  className="h-5 w-5"
                  draggable={false}
                />
              }
            />
          </div>

          {todayNewsList.length > 0 ? (
            <Carousel>
              {todayNewsList.map((news) => (
                <TodayNewsCarouselCard key={news.newsId} news={news} />
              ))}
            </Carousel>
          ) : (
            <div className="bg-neutral-0 text-body-14-md mx-5 flex h-[331px] items-center justify-center rounded-[16px] border border-neutral-100 text-neutral-400">
              {todayNewsQuery.isLoading
                ? "금융 소식을 불러오는 중이에요."
                : "표시할 금융 소식이 없어요."}
            </div>
          )}
        </section>

        <section className="flex flex-col gap-2 px-5">
          <div className="px-1">
            <SectionHeader
              title="수익 TOP 3 섹터"
              icon={
                <img
                  src={rankingIcon}
                  alt=""
                  aria-hidden="true"
                  className="h-5 w-5"
                  draggable={false}
                />
              }
            />
          </div>
          <TopSectorList sectors={HOME_TOP_SECTORS} />
        </section>
      </div>
    </div>
  );
}

export default HomePage;
