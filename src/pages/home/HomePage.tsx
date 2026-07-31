import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Logo from "@/components/common/Logo";
import Carousel from "@/components/common/Carousel";
import SectionHeader from "@/components/common/SectionHeader";
import megaphoneIcon from "@/assets/icon-20px/megaphone.svg";
import rankingIcon from "@/assets/icon-20px/ranking.svg";

import CharacterGreeting from "./components/CharacterGreeting";
import HomePageSkeleton from "./components/HomePageSkeleton";
import AssetCard from "./components/AssetCard";
import QuizBanner from "./components/QuizBanner";
import NewsCard from "./components/NewsCard";
import TopSectorList from "./components/TopSectorList";
import InvestResultSheet from "./components/InvestResultSheet";
import BottomSheet from "@/components/common/BottomSheet";
import RecentPerformanceSheetContent from "@/pages/invest/stats/components/RecentPerformanceSheetContent";
import { statsMock } from "@/pages/invest/stats/mocks/statsMock";
import { getMyHome } from "@/lib/mypageApi";
import { useInvestmentAssetQuery } from "@/pages/invest/investmentAssetQueries";
import {
  HOME_USER,
  HOME_ASSETS,
  HOME_NEWS,
  HOME_TOP_SECTORS,
  HOME_INVEST_RESULT,
} from "./homeData";

const INVEST_RESULT_SEEN_KEY = "muffin:investResultSeenDate";

// 변동 방향(UP/DOWN)에 따라 부호를 붙인다
function signByDirection(value: number, direction: string) {
  if (direction === "DOWN") return -Math.abs(value);
  if (direction === "UP") return Math.abs(value);
  return value;
}

// Figma Home: 위 흰색 → 아래 주황빛(secondary-300 20%) 그라데이션 위에
// 캐릭터·총자산 카드, 그 아래 흰색 라운드 시트(퀴즈·뉴스·TOP3)가 얹히는 구조
function HomePage() {
  const navigate = useNavigate();
  // 최근 투자 성과 클릭 시 수익 통계와 동일한 상세 바텀시트 노출
  const [recentPerformanceOpen, setRecentPerformanceOpen] = useState(false);

  // 닉네임은 서버(/api/mypage/home)에서 조회. 초기값을 목으로 두면 틀린 이름이
  // 잠깐 노출되므로(예: 예은) 빈 값으로 시작해 응답 후 채운다.
  const [nickname, setNickname] = useState("");

  useEffect(() => {
    let active = true;
    getMyHome()
      .then((home) => {
        if (active) setNickname(home.nickname);
      })
      .catch(() => {
        // 조회 실패 — 기존 닉네임 유지
      });
    return () => {
      active = false;
    };
  }, []);

  // 총자산은 서버(/api/investments/asset)에서 조회, 실패/로딩 시 기존 표시값 유지
  const investmentAssetQuery = useInvestmentAssetQuery();
  const investmentAsset = investmentAssetQuery.data;
  const homeAssets = investmentAsset
    ? {
        ...HOME_ASSETS,
        total: investmentAsset.totalAsset,
        change: signByDirection(
          investmentAsset.dailyChangeAmount,
          investmentAsset.changeDirection,
        ),
        changeRate: signByDirection(
          investmentAsset.dailyChangeRate,
          investmentAsset.changeDirection,
        ),
      }
    : HOME_ASSETS;

  // 투자결과 모달 자동 노출: 오전 10시 이후 & 아직 확인 안 한 전날 정산 결과일 때만 열림
  const [investResultOpen, setInvestResultOpen] = useState(
    () =>
      new Date().getHours() >= 10 &&
      localStorage.getItem(INVEST_RESULT_SEEN_KEY) !== HOME_INVEST_RESULT.date,
  );

  // 자동 노출되면 '확인함'으로 기록 → 같은 결과는 하루 1회만
  // TODO: 서버가 '어제 정산 결과 + 미확인 여부'를 내려주면 그 값으로 교체
  useEffect(() => {
    if (investResultOpen) {
      localStorage.setItem(INVEST_RESULT_SEEN_KEY, HOME_INVEST_RESULT.date);
    }
  }, [investResultOpen]);

  // 총자산 최초 로딩 동안에는 스켈레톤을 노출 (mock 값 깜빡임 방지)
  if (investmentAssetQuery.isLoading) {
    return <HomePageSkeleton />;
  }

  return (
    <div className="flex min-h-full flex-col bg-[linear-gradient(180deg,rgba(255,255,255,0.2)_23.6%,rgba(255,194,102,0.2)_36.4%),linear-gradient(#fff,#fff)]">
      <header className="flex h-[52px] shrink-0 items-center px-5">
        <Logo size="xs" />
      </header>

      <div className="flex flex-col px-5 pt-4">
        <CharacterGreeting message={HOME_USER.message} />
      </div>

      <div className="mt-1 px-5">
        <AssetCard
          nickname={nickname}
          streakDays={HOME_USER.streakDays}
          assets={homeAssets}
          onRecentClick={() => setRecentPerformanceOpen(true)}
        />
      </div>

      {/* 수익 통계(StatsPage)와 동일한 최근 투자 성과 상세 바텀시트 재사용 */}
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

      {/* 전날 투자 결과 모달: 오전 10시 이후 첫 접속 시 1회 자동 노출 */}
      <InvestResultSheet
        isOpen={investResultOpen}
        onClose={() => setInvestResultOpen(false)}
        result={HOME_INVEST_RESULT}
        onDetailClick={() => navigate("/invest/stats")}
        onInvestClick={() => navigate("/invest")}
      />

      {/* 흰색 라운드 시트: 퀴즈·금융 소식·수익 TOP3 */}
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
          <Carousel>
            {HOME_NEWS.map((news) => (
              <NewsCard
                key={news.id}
                news={news}
                onClick={() => navigate(`/news/${news.id}`)}
              />
            ))}
          </Carousel>
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
