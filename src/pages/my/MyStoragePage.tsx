import { useNavigate, useSearchParams } from "react-router-dom";
import TopBar from "../../components/common/TopBar";
import ScrappedNewsTab from "./components/ScrappedNewsTab";
import SavedWordsTab from "./components/SavedWordsTab";
import QuizReviewTab from "./components/QuizReviewTab";

type TabType = "news" | "word" | "quiz";

export default function MyStoragePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentTab = (searchParams.get("tab") || "news") as TabType;

  const tabTitleMap: Record<TabType, string> = {
    news: "스크랩한 뉴스",
    word: "저장한 용어",
    quiz: "퀴즈 복습",
  };

  return (
    <div className="w-[390px] h-[844px] bg-[#F5F5F5] flex flex-col text-black overflow-hidden relative mx-auto">
      <div className="w-full bg-white border-b border-neutral-100 z-50 shrink-0">
        <TopBar 
          title={tabTitleMap[currentTab] || "학습 저장소"} 
          showBack={true} 
          onBack={() => navigate(-1)} 
          background="white"
        />
      </div>

      <div className="flex-1 w-full overflow-y-auto">
        {currentTab === "news" && <ScrappedNewsTab />}
        {currentTab === "word" && <SavedWordsTab />}
        {currentTab === "quiz" && <QuizReviewTab />}
      </div>
    </div>
  );
}