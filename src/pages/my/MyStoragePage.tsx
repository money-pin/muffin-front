import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import TopBar from "../../components/common/TopBar";
import ScrappedNewsTab from "./components/ScrappedNewsTab";
import RecentNewsTab from "./components/RecentNewsTab";
import SavedWordsTab from "./components/SavedWordsTab";
import QuizReviewTab from "./components/QuizReviewTab";

type TabType = "news" | "read" | "word" | "quiz";

export default function MyStoragePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentTab = (searchParams.get("tab") || "news") as TabType;

  // 퀴즈 복습 상세는 날짜(quizDate) 기준으로 선택 (상세는 QuizReviewTab에서 조회)
  const [selectedQuizDate, setSelectedQuizDate] = useState<string | null>(null);

  const tabTitleMap: Record<TabType, string> = {
    news: "스크랩한 뉴스",
    read: "최근 읽은 뉴스",
    word: "저장한 용어",
    quiz: "퀴즈 복습",
  };

  const getTitle = () => {
    if (currentTab === "quiz" && selectedQuizDate) {
      return `${selectedQuizDate} 퀴즈 복습`;
    }
    return tabTitleMap[currentTab] || "학습 저장소";
  };

  const handleBack = () => {
    if (currentTab === "quiz" && selectedQuizDate) {
      setSelectedQuizDate(null);
      return;
    }
    navigate(-1);
  };

  return (
    /* 📌 bg-[#F5F5F5] -> bg-white 변경으로 전체 흰색 배경 통일 */
    <div className="relative mx-auto flex min-h-full w-full max-w-[var(--max-width-app)] flex-col bg-white text-black">
      {/* 고정 TopBar */}
      <div className="z-50 w-full shrink-0 border-b border-neutral-100 bg-white">
        <TopBar
          title={getTitle()}
          showBack={true}
          onBack={handleBack}
          background="white"
        />
      </div>

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
