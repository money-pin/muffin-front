import {
  useQuizHistoryDetailQuery,
  useQuizHistoryQuery,
} from "@/pages/quiz/api/queries";
import type { QuizHistoryOption } from "@/pages/quiz/api/types";

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

// 보기 하나의 스타일/배지 결정 (선택 여부 + 정답 여부 기준)
function getOptionStyle(option: QuizHistoryOption) {
  if (option.isSelected && option.isCorrect) {
    return {
      className: "bg-primary-50 border-primary text-primary font-bold",
      badgeText: "내 정답",
      badgeClass: "bg-primary text-white",
    };
  }
  if (option.isSelected && !option.isCorrect) {
    return {
      className: "bg-positive-50 border-positive text-positive font-bold",
      badgeText: "내 오답",
      badgeClass: "bg-positive text-white",
    };
  }
  if (!option.isSelected && option.isCorrect) {
    return {
      className: "bg-primary-50 border-primary text-primary font-bold",
      badgeText: "정답",
      badgeClass: "bg-primary text-white",
    };
  }
  return {
    className: "bg-neutral-50/70 border-transparent text-neutral-900",
    badgeText: null as string | null,
    badgeClass: "",
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
      <div className="flex flex-col gap-4 p-5 pb-36">
        <div className="flex shrink-0 items-center justify-between rounded-xl border border-neutral-100 bg-white p-4">
          <span className="text-body-14-md text-neutral-600">맞힌 문제 수</span>
          <div className="text-body-16-bd">
            <span className="text-primary">{summary.correctCount}</span>
            <span className="text-neutral-400">/{summary.totalCount}</span>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {questions.map((question, index) => (
            <div
              key={question.quizId}
              className={`flex flex-col gap-4 rounded-xl border bg-white px-4 py-5 ${
                question.isCorrect ? "border-neutral-100" : "border-positive"
              }`}
            >
              <h3 className="text-body-16-md-tighter leading-[1.6] whitespace-pre-line text-neutral-900">
                {`Q${index + 1}. ${question.question}`}
              </h3>

              <div className="flex flex-col gap-2.5">
                {question.options.map((option) => {
                  const style = getOptionStyle(option);
                  return (
                    <div
                      key={option.optionId}
                      className={`text-body-14-md flex min-h-[52px] items-center justify-between gap-2 rounded-xl border px-4 transition-colors ${style.className}`}
                    >
                      <span className="min-w-0 flex-1 break-keep">
                        {option.content}
                      </span>
                      {style.badgeText && (
                        <span
                          className={`text-caption-12-bd shrink-0 rounded-full px-2.5 py-1 ${style.badgeClass}`}
                        >
                          {style.badgeText}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-1 flex flex-col gap-1.5 pt-1">
                <div className="text-caption-12-md flex items-center gap-1.5 text-neutral-500">
                  <svg
                    width="16"
                    height="16"
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
    return <ReviewMessage>아직 복습할 퀴즈 기록이 없어요.</ReviewMessage>;
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
          <div className="text-body-16-bd">
            <span className="text-primary">{item.correctCount}</span>
            <span className="text-neutral-300">/{item.totalCount}</span>
          </div>
        </button>
      ))}
    </div>
  );
}
