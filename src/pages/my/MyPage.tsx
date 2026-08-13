import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import SectionHeader from "@/components/common/SectionHeader";
import ErrorModal from "@/components/common/ErrorModal";
import { ApiError } from "@/lib/api";
import { CHARACTER_LABELS, characterTypeToVariant } from "@/lib/character";
import { getErrorMessage, type ErrorMessageInfo } from "@/lib/errorMessages";
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
  const [nicknameError, setNicknameError] = useState<ErrorMessageInfo | null>(
    null,
  );

  // 닉네임 변경: 홈·마이 공유 캐시를 낙관적으로 갱신하되,
  // 서버 저장이 실패하면 이전 값으로 롤백하고 사용자에게 알린다.
  const nicknameMutation = useMutation({
    mutationFn: (next: string) => updateNickname(next),
    onMutate: async (next) => {
      await queryClient.cancelQueries({ queryKey: mypageQueryKeys.home() });
      const previous = queryClient.getQueryData<MyHome>(mypageQueryKeys.home());
      queryClient.setQueryData<MyHome>(mypageQueryKeys.home(), (old) =>
        old ? { ...old, nickname: next } : old,
      );
      return { previous };
    },
    onError: (error, _next, context) => {
      if (context?.previous) {
        queryClient.setQueryData(mypageQueryKeys.home(), context.previous);
      }
      setNicknameError(
        getErrorMessage(error instanceof ApiError ? error.code : "", {
          title: "닉네임 변경에 실패했어요.",
          description: "잠시 후 다시 시도해주세요.",
          primaryLabel: "확인",
          // 탈퇴 실패와 동일하게 단순 안내 정책으로 통일 (확인 단일 버튼)
          secondaryLabel: undefined,
        }),
      );
    },
  });

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
      bookmarked: news.isScrapped,
    }),
  );

  return (
    <div className="flex min-h-[calc(100dvh-80px)] flex-col bg-neutral-50">
      <div className="bg-white pb-[clamp(12px,4vw,16px)]">
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

        <div className="mt-[clamp(12px,4vw,16px)] px-5">
          <StreakWeekCard
            streakDays={streakDays}
            weekChecks={weekChecks}
            todayIndex={todayIndex}
          />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-[clamp(24px,7vw,32px)] border-t border-neutral-100 bg-neutral-50 px-5 pt-[clamp(16px,5vw,20px)] pb-[clamp(24px,7vw,32px)]">
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
            setNicknameModalOpen(false);
            nicknameMutation.mutate(next);
          }}
        />
      )}
      {nicknameError && (
        <ErrorModal
          isOpen
          info={nicknameError}
          onPrimaryAction={() => setNicknameError(null)}
          onClose={() => setNicknameError(null)}
        />
      )}
    </div>
  );
}

export default MyPage;
