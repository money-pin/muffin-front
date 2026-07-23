import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import TopBar from "../../components/common/TopBar";
import ScrappedNewsTab from "./components/ScrappedNewsTab";
import SavedWordsTab from "./components/SavedWordsTab";
import QuizReviewTab from "./components/QuizReviewTab";
import { type QuizHistoryItem } from "./quizReviewData";

type TabType = "news" | "word" | "quiz";

export default function MyStoragePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentTab = (searchParams.get("tab") || "news") as TabType;

  // 퀴즈 복습 상세 선택 상태를 부모에서 관리
  const [selectedQuizHistory, setSelectedQuizHistory] = useState<QuizHistoryItem | null>(null);

  const tabTitleMap: Record<TabType, string> = {
    news: "스크랩한 뉴스",
    word: "저장한 용어",
    quiz: "퀴즈 복습",
  };

  const getTitle = () => {
    if (currentTab === "quiz" && selectedQuizHistory) {
      return `${selectedQuizHistory.date} 퀴즈 복습`;
    }
    return tabTitleMap[currentTab] || "학습 저장소";
  };

  const handleBack = () => {
    if (currentTab === "quiz" && selectedQuizHistory) {
      setSelectedQuizHistory(null);
      return;
    }
    navigate(-1);
  };

  return (
    /* 📌 bg-[#F5F5F5] -> bg-white 변경으로 전체 흰색 배경 통일 */
    <div className="w-full max-w-[var(--max-width-app,390px)] min-h-full bg-white flex flex-col text-black relative mx-auto">
      {/* 고정 TopBar */}
      <div className="w-full bg-white border-b border-neutral-100 z-50 shrink-0">
        <TopBar 
          title={getTitle()} 
          showBack={true} 
          onBack={handleBack} 
          background="white"
        />
      </div>

      <div className="flex-1 w-full overflow-y-auto min-h-0">
        {currentTab === "news" && <ScrappedNewsTab />}
        {currentTab === "word" && <SavedWordsTab />}
        {currentTab === "quiz" && (
          <QuizReviewTab
            selectedHistory={selectedQuizHistory}
            onSelectHistory={setSelectedQuizHistory}
          />
        )}
      </div>
    </div>
  );
}