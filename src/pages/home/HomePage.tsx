import { useNavigate } from "react-router-dom";

import Logo from "@/components/common/Logo";
import Carousel from "@/components/common/Carousel";
import SectionHeader from "@/components/common/SectionHeader";
import megaphoneIcon from "@/assets/icon-20px/megaphone.svg";

import CharacterGreeting from "./components/CharacterGreeting";
import AssetCard from "./components/AssetCard";
import QuizBanner from "./components/QuizBanner";
import NewsCard from "./components/NewsCard";
import { HOME_USER, HOME_ASSETS, HOME_NEWS } from "./homeData";

// Figma Home: 위 흰색 → 아래 주황빛(secondary-300 20%) 그라데이션 위에
// 캐릭터·총자산 카드, 그 아래 흰색 라운드 시트(퀴즈·뉴스·TOP3)가 얹히는 구조
function HomePage() {
  const navigate = useNavigate();

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
          nickname={HOME_USER.nickname}
          streakDays={HOME_USER.streakDays}
          assets={HOME_ASSETS}
          onRecentClick={() => navigate("/stats")}
        />
      </div>

      {/* 흰색 라운드 시트: 퀴즈·금융 소식·수익 TOP3 */}
      <div className="mt-7 flex flex-1 flex-col gap-9 rounded-t-[24px] bg-white pb-9 pt-6 shadow-[0px_-3px_7px_rgba(0,0,0,0.1)]">
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
      </div>
    </div>
  );
}

export default HomePage;
