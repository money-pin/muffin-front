import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

import SectionHeader from "@/components/common/SectionHeader";
import { CHARACTER_LABELS, characterTypeToVariant } from "@/lib/character";
import { updateNickname, type MyHome, type WeekDay } from "@/lib/mypageApi";
import { mypageQueryKeys, useMyHomeQuery } from "@/lib/mypageQueries";
import { getNewsImage } from "@/lib/newsFormat";
import chevronRightIcon from "@/assets/icon-20px/iconarrow-gray03.svg";
import settingIcon from "@/assets/icon-24px/setting.svg";

import MyPageSkeleton from "./components/MyPageSkeleton";
import MyProfile from "./components/MyProfile";
import StreakWeekCard from "./components/StreakWeekCard";
import StorageShortcuts from "./components/StorageShortcuts";
import RecentNewsList from "./components/RecentNewsList";
import NicknameModal from "./components/NicknameModal";
import type { MyRecentNews } from "./myData";

// 스트릭 주간 카드는 일~토 순서를 기대한다 (API weeklyActivity를 이 순서로 정렬)
const WEEK_ORDER: WeekDay[] = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

// Figma 마이: 프로필·스트릭 영역(주황빛 배경) + 학습 저장소·최근 읽은 뉴스(흰 배경)
function MyPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [nicknameModalOpen, setNicknameModalOpen] = useState(false);

  // 닉네임·캐릭터·스트릭·최근뉴스 모두 /api/mypage/home 응답에서 조회 (홈과 캐시 공유).
  // 로딩 동안엔 스켈레톤을 노출해 mock/빈 값 깜빡임을 막는다.
  const myHomeQuery = useMyHomeQuery();
  const home = myHomeQuery.data;
  const nickname = home?.nickname ?? "";

  if (myHomeQuery.isLoading) {
    return <MyPageSkeleton />;
  }

  // 캐릭터: 서버 characterType(대문자) → 화면 variant, 라벨은 서버 캐릭터명 우선
  const characterVariant = home?.character
    ? characterTypeToVariant(home.character.characterType)
    : "plain";
  const characterLabel =
    home?.character?.characterName ?? CHARACTER_LABELS[characterVariant];

  // 스트릭: weeklyActivity(요일 무순) → 일~토 참여 여부 배열
  const streakDays = home?.streak?.currentStreak ?? 0;
  const weekChecks = WEEK_ORDER.map(
    (weekDay) =>
      home?.streak?.weeklyActivity.find((activity) => activity.day === weekDay)
        ?.participated ?? false,
  );
  const todayIndex = new Date().getDay(); // 0=일 … 6=토 (WEEK_ORDER와 동일)

  // 최근 읽은 뉴스: API 응답 → 카드 목록 형태로 매핑
  const recentNewsList: MyRecentNews[] = (home?.recentNews ?? []).map(
    (news) => ({
      id: news.newsId,
      title: news.title,
      image: getNewsImage(news.thumbnailUrl, news.categoryName),
      bookmarked: false,
    }),
  );

  return (
    <div className="flex min-h-[calc(100dvh-80px)] flex-col bg-neutral-50">
      <div className="bg-white pb-4">
        <header className="flex h-[52px] items-center justify-end px-5">
          <button
            type="button"
            onClick={() => navigate("/my/settings")}
            aria-label="설정"
            className="-mr-3 flex size-11 shrink-0 items-center justify-center"
          >
            <img
              src={settingIcon}
              alt=""
              aria-hidden="true"
              className="size-6"
              draggable={false}
            />
          </button>
        </header>

        <MyProfile
          nickname={nickname}
          characterVariant={characterVariant}
          characterLabel={characterLabel}
          onEditNickname={() => setNicknameModalOpen(true)}
        />

        <div className="mt-4 px-5">
          <StreakWeekCard
            streakDays={streakDays}
            weekChecks={weekChecks}
            todayIndex={todayIndex}
          />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-8 border-t border-neutral-100 bg-neutral-50 px-5 pt-5 pb-8">
        <section className="flex flex-col gap-3">
          <SectionHeader title="학습 저장소" />
          {/* 탭 클릭 시 파라미터(?tab=menu)를 포함해 이동 */}
          <StorageShortcuts
            onNavigate={(menu) => navigate(`/my/storage?tab=${menu}`)}
          />
        </section>

        <section className="flex flex-col gap-3">
          <div className="flex h-[26px] items-center justify-between">
            <h2 className="text-body-16-bd-tighter text-neutral-900">
              최근 읽은 뉴스
            </h2>
            <button
              type="button"
              onClick={() => navigate("/my/storage?tab=read")}
              aria-label="최근 읽은 뉴스 더보기"
              className="-mr-3 flex size-11 shrink-0 items-center justify-center"
            >
              <img
                src={chevronRightIcon}
                alt=""
                aria-hidden="true"
                draggable={false}
              />
            </button>
          </div>
          <RecentNewsList
            newsList={recentNewsList}
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
            // 캐시를 낙관적으로 갱신 (홈·마이 공유 캐시라 양쪽 즉시 반영)
            queryClient.setQueryData<MyHome>(mypageQueryKeys.home(), (old) =>
              old ? { ...old, nickname: next } : old,
            );
            setNicknameModalOpen(false);
            // 변경한 닉네임을 서버에 저장 (실패해도 화면은 낙관적으로 반영)
            updateNickname(next).catch(() => {});
          }}
        />
      )}
    </div>
  );
}

export default MyPage;
