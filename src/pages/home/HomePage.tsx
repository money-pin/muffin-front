import { useNavigate } from "react-router-dom";

import Logo from "@/components/common/Logo";

import CharacterGreeting from "./components/CharacterGreeting";
import AssetCard from "./components/AssetCard";
import { HOME_USER, HOME_ASSETS } from "./homeData";

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

      {/* 흰색 라운드 시트: 퀴즈·금융 소식·수익 TOP3 (다음 커밋에서 채움) */}
      <div className="mt-7 flex flex-1 flex-col gap-9 rounded-t-[24px] bg-white pb-9 pt-6 shadow-[0px_-3px_7px_rgba(0,0,0,0.1)]" />
    </div>
  );
}

export default HomePage;
