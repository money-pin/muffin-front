import { useEffect, useState } from "react";
import {
  useNavigate,
  useOutletContext,
  useSearchParams,
} from "react-router-dom";

import type { TopBarOutletContext } from "@/layouts/TopBarLayout";

import QuizReviewTab from "./components/QuizReviewTab";
import RecentNewsTab from "./components/RecentNewsTab";
import SavedWordsTab from "./components/SavedWordsTab";
import ScrappedNewsTab from "./components/ScrappedNewsTab";

type TabType = "news" | "read" | "word" | "quiz";

const TAB_TITLE_MAP: Record<TabType, string> = {
  news: "스크랩한 뉴스",
  read: "최근 읽은 뉴스",
  word: "저장한 용어",
  quiz: "퀴즈 복습",
};

function parseStorageTab(value: string | null): TabType {
  if (value === "read" || value === "word" || value === "quiz") {
    return value;
  }

  return "news";
}

function getStorageTitle(tab: TabType, selectedQuizDate: string | null) {
  if (tab === "quiz" && selectedQuizDate) {
    return `${selectedQuizDate} 퀴즈 복습`;
  }

  return TAB_TITLE_MAP[tab];
}

export default function MyStoragePage() {
  const navigate = useNavigate();
  const { setTopBar, resetTopBar } = useOutletContext<TopBarOutletContext>();
  const [searchParams] = useSearchParams();
  const currentTab = parseStorageTab(searchParams.get("tab"));

  const [selectedQuizDate, setSelectedQuizDate] = useState<string | null>(null);

  useEffect(() => {
    setTopBar({
      title: getStorageTitle(currentTab, selectedQuizDate),
      showBack: true,
      onBack: () => {
        if (currentTab === "quiz" && selectedQuizDate) {
          setSelectedQuizDate(null);
          return;
        }

        navigate(-1);
      },
    });

    return resetTopBar;
  }, [currentTab, navigate, resetTopBar, selectedQuizDate, setTopBar]);

  return (
    <div className="relative mx-auto flex min-h-full w-full max-w-[var(--max-width-app)] flex-col bg-white text-black">
      <div className="min-h-0 w-full flex-1 overflow-y-auto">
        {currentTab === "news" && <ScrappedNewsTab />}
        {currentTab === "read" && <RecentNewsTab />}
        {currentTab === "word" && <SavedWordsTab />}
        {currentTab === "quiz" && (
          <QuizReviewTab
            selectedDate={selectedQuizDate}
            onSelectDate={setSelectedQuizDate}
          />
        )}
      </div>
    </div>
  );
}
