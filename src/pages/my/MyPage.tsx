import { useState } from "react";
import { useNavigate } from "react-router-dom";

import SectionHeader from "@/components/common/SectionHeader";
import chevronRightIcon from "@/assets/icon-24px/chevron-right.svg";

import MyProfile from "./components/MyProfile";
import StreakWeekCard from "./components/StreakWeekCard";
import StorageShortcuts from "./components/StorageShortcuts";
import RecentNewsList from "./components/RecentNewsList";
import NicknameModal from "./components/NicknameModal";
import {
  MY_RECENT_NEWS,
  MY_TODAY_INDEX,
  MY_USER,
  MY_WEEK_CHECKS,
} from "./myData";

// Figma 마이: 프로필·스트릭 영역(주황빛 배경) + 학습 저장소·최근 읽은 뉴스(흰 배경)
function MyPage() {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState(MY_USER.nickname);
  const [nicknameModalOpen, setNicknameModalOpen] = useState(false);

  return (
    <div className="flex min-h-full flex-col">
      <div className="bg-white pb-6">
        <header className="flex h-[52px] items-center justify-end px-5">
          <button
            type="button"
            onClick={() => navigate("/my/settings")}
            aria-label="설정"
          >
            <svg
              aria-hidden="true"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--color-neutral-900)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.09a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.09a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
            </svg>
          </button>
        </header>

        <MyProfile
          nickname={nickname}
          characterVariant={MY_USER.characterVariant}
          characterLabel={MY_USER.characterLabel}
          onEditNickname={() => setNicknameModalOpen(true)}
        />

        <div className="mt-5 px-5">
          <StreakWeekCard
            streakDays={MY_USER.streakDays}
            weekChecks={MY_WEEK_CHECKS}
            todayIndex={MY_TODAY_INDEX}
          />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-9 border-t border-neutral-100 bg-[#f9f9f9] px-5 pb-9 pt-6">
        <section className="flex flex-col gap-4">
          <SectionHeader title="학습 저장소" />
          <StorageShortcuts onNavigate={() => navigate("/my/storage")} />
        </section>

        <section className="flex flex-col gap-4">
          <SectionHeader
            title="최근 읽은 뉴스"
            right={
              <button
                type="button"
                onClick={() => navigate("/news")}
                aria-label="뉴스 더보기"
              >
                <img
                  src={chevronRightIcon}
                  alt=""
                  aria-hidden="true"
                  className="h-6 w-6"
                />
              </button>
            }
          />
          <RecentNewsList
            newsList={MY_RECENT_NEWS}
            onNewsClick={(newsId) => navigate(`/news/${newsId}`)}
          />
        </section>
      </div>

      {nicknameModalOpen && (
        <NicknameModal
          isOpen
          currentNickname={nickname}
          onClose={() => setNicknameModalOpen(false)}
          onChange={(next) => {
            setNickname(next);
            setNicknameModalOpen(false);
          }}
        />
      )}
    </div>
  );
}

export default MyPage;
