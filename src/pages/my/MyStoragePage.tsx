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

  // 📌 기획 의도 반영 TopBar 타이틀
  const getTitle = () => {
    if (currentTab === "quiz" && selectedQuizHistory) {
      return `${selectedQuizHistory.date} 퀴즈 복습`;
    }
    return tabTitleMap[currentTab] || "학습 저장소";
  };

  // 📌 기획 의도 반영 뒤로가기 동작
  const handleBack = () => {
    // 퀴즈 복습 상세 화면을 보고 있다면 -> 퀴즈 복습 목록으로 복귀
    if (currentTab === "quiz" && selectedQuizHistory) {
      setSelectedQuizHistory(null);
      return;
    }
    // 그 외 기본 화면에서는 이전 페이지(마이페이지)로 이동
    navigate(-1);
  };

  return (
    <div className="w-[390px] h-[844px] bg-[#F5F5F5] flex flex-col text-black overflow-hidden relative mx-auto">
      {/* 고정 TopBar (타이틀 및 뒤로가기가 상태에 따라 동적 변경) */}
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