import {
  useQuizHistoryDetailQuery,
  useQuizHistoryQuery,
} from "@/pages/quiz/api/queries";
import type { QuizHistoryOption } from "@/pages/quiz/api/types";
import StorageEmptyState from "./StorageEmptyState";

interface QuizReviewTabProps {
  selectedDate: string | null;
  onSelectDate: (date: string | null) => void;
}

function ReviewMessage({ children }: { children: string }) {
  return (
    <p className="text-body-14-md px-5 py-16 text-center text-neutral-400">
      {children}
    </p>
  );
}

// 문제별 정답/오답 상태 아이콘 (원=상태색 currentColor, 마크=neutral-0)
function QuizStatusIcon({ isCorrect }: { isCorrect: boolean }) {
  if (isCorrect) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        aria-label="정답"
        role="img"
        className="size-6 shrink-0 text-green-400"
      >
        <circle cx="12" cy="12" r="10" fill="currentColor" />
        <path
          d="M7.5 12L10.5 15L16.5 9"
          className="stroke-neutral-0"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-label="오답"
      role="img"
      className="text-positive size-6 shrink-0"
    >
      <circle cx="12" cy="12" r="10" fill="currentColor" />
      <path
        d="M7.75 7.75L16.25 16.25M16.25 7.75L7.75 16.25"
        className="stroke-neutral-0"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type OptionStyle = {
  container: string;
  text: string;
  showCorrectBadge: boolean;
};

// 보기 하나의 스타일 결정 (선택 여부 + 정답 여부 기준)
// 배지는 "내가 고르지 않은 정답 보기"에만 노출. 내가 고른 보기는 색으로만 구분.
function getOptionStyle(option: QuizHistoryOption): OptionStyle {
  // 내가 고른 정답
  if (option.isSelected && option.isCorrect) {
    return {
      container: "bg-green-100 border-green-200",
      text: "text-body-16-bd-tighter text-green-400",
      showCorrectBadge: false,
    };
  }
  // 내가 고른 오답
  if (option.isSelected && !option.isCorrect) {
    return {
      container: "bg-positive-50 border-positive-300",
      text: "text-body-16-bd-tighter text-positive",
      showCorrectBadge: false,
    };
  }
  // 내가 고르지 않은 정답 → "정답" 배지 노출
  if (!option.isSelected && option.isCorrect) {
    return {
      container: "bg-green-100 border-green-200",
      text: "text-body-16-bd-tighter text-green-400",
      showCorrectBadge: true,
    };
  }
  // 기본
  return {
    container: "bg-neutral-50/70 border-transparent",
    text: "text-body-16-md-tighter text-neutral-900",
    showCorrectBadge: false,
  };
}

export default function QuizReviewTab({
  selectedDate,
  onSelectDate,
}: QuizReviewTabProps) {
  const listQuery = useQuizHistoryQuery();
  const detailQuery = useQuizHistoryDetailQuery(selectedDate);

  // 1️⃣ 상세 복습 화면 (날짜가 선택되어 있을 때)
  if (selectedDate) {
    if (detailQuery.isLoading) {
      return <ReviewMessage>복습 내용을 불러오는 중이에요.</ReviewMessage>;
    }
    if (detailQuery.isError || !detailQuery.data) {
      return <ReviewMessage>복습 내용을 불러오지 못했어요.</ReviewMessage>;
    }

    const { summary, questions } = detailQuery.data;
    return (
      <div className="flex min-h-full flex-col gap-4 bg-neutral-50/70 p-5 pb-36">
        <div className="flex shrink-0 items-center justify-between rounded-xl border border-neutral-100 bg-white p-4">
          <span className="text-body-14-md text-neutral-600">맞힌 문제 수</span>
          <div className="text-body-16-bd rounded-lg bg-neutral-50/70 px-2 py-1">
            <span className="text-primary">{summary.correctCount}</span>
            <span className="text-neutral-400">/{summary.totalCount}</span>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {questions.map((question, index) => (
            <div
              key={question.quizId}
              className={`flex flex-col gap-6 rounded-xl border bg-white px-4 py-5 ${
                question.isCorrect ? "border-neutral-100" : "border-positive"
              }`}
            >
              {/* Question Body: 헤더 + 보기 */}
              <div className="flex flex-col gap-4">
                {/* 헤더: 문제 텍스트 + 정답/오답 상태 아이콘 */}
                <div className="flex items-start gap-1">
                  <h3 className="text-body-16-md-tighter flex-1 leading-[1.6] whitespace-pre-line text-neutral-900">
                    {`Q${index + 1}. ${question.question}`}
                  </h3>
                  <span className="mt-0.5">
                    <QuizStatusIcon isCorrect={question.isCorrect} />
                  </span>
                </div>

                {/* 보기 리스트 */}
                <div className="flex flex-col gap-2">
                  {question.options.map((option) => {
                    const style = getOptionStyle(option);
                    return (
                      <div
                        key={option.optionId}
                        className={`flex items-center justify-between gap-2 rounded-lg border px-4 py-3 transition-colors ${style.container}`}
                      >
                        <span
                          className={`min-w-0 flex-1 break-keep ${style.text}`}
                        >
                          {option.content}
                        </span>
                        {style.showCorrectBadge && (
                          <span className="text-body-14-bd bg-green shrink-0 rounded-full px-3 py-1 text-white">
                            정답
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 해설 */}
              <div className="flex flex-col gap-3">
                <div className="text-caption-12-md flex items-center gap-1 text-neutral-500">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-neutral-500"
                  >
                    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1.3.5 2.6 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
                    <path d="M9 18h6" />
                    <path d="M10 22h4" />
                  </svg>
                  <span>해설</span>
                </div>
                <p className="text-body-14-md leading-relaxed text-neutral-700">
                  {question.explanation}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 2️⃣ 날짜별 퀴즈 복습 목록 화면 (기본 화면)
  if (listQuery.isLoading) {
    return <ReviewMessage>퀴즈 복습 기록을 불러오는 중이에요.</ReviewMessage>;
  }
  if (listQuery.isError) {
    return <ReviewMessage>퀴즈 복습 기록을 불러오지 못했어요.</ReviewMessage>;
  }

  const histories = listQuery.data?.histories ?? [];
  if (histories.length === 0) {
    return (
      <StorageEmptyState
        title="아직 퀴즈 이력이 없어요."
        description="퀴즈를 풀고 복습해보세요."
      />
    );
  }

  return (
    <div className="flex flex-col gap-3 p-5 pb-20">
      {histories.map((item) => (
        <button
          key={item.quizDate}
          type="button"
          onClick={() => onSelectDate(item.quizDate)}
          className="transition-active flex h-16 w-full items-center justify-between rounded-xl border border-neutral-100 bg-white px-5 active:bg-neutral-50"
        >
          <span className="text-body-16-bd text-neutral-900">
            {item.quizDate}
          </span>
          <div className="text-body-16-bd rounded-lg bg-neutral-50/70 px-2 py-1">
            <span className="text-primary">{item.correctCount}</span>
            <span className="text-neutral-300">/{item.totalCount}</span>
          </div>
        </button>
      ))}
    </div>
  );
}
