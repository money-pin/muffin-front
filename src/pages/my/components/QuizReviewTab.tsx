import { DUMMY_QUIZ_HISTORY, type QuizHistoryItem } from "../quizReviewData";

interface QuizReviewTabProps {
  selectedHistory: QuizHistoryItem | null;
  onSelectHistory: (item: QuizHistoryItem | null) => void;
}

export default function QuizReviewTab({
  selectedHistory,
  onSelectHistory,
}: QuizReviewTabProps) {
  // 1️⃣ 상세 복습 화면 (날짜가 선택되어 있을 때)
  if (selectedHistory) {
    return (
      <div className="flex flex-col gap-4 p-5 pb-36">
        {/* 맞힌 문제 수 요약 카운터 */}
        <div className="flex shrink-0 items-center justify-between rounded-xl border border-neutral-100 bg-white p-4">
          <span className="text-body-14-md text-neutral-600">맞힌 문제 수</span>
          <div className="text-body-16-bd">
            <span className="text-primary">{selectedHistory.score}</span>
            <span className="text-neutral-400">/{selectedHistory.total}</span>
          </div>
        </div>

        {/* 문제 목록 */}
        <div className="flex flex-col gap-6">
          {selectedHistory.questions && selectedHistory.questions.length > 0 ? (
            selectedHistory.questions.map((q, index) => {
              const isCorrect = q.userAnswerId === q.answerId;

              return (
                <div
                  key={q.id}
                  className={`flex flex-col gap-4 rounded-xl border bg-white px-4 py-5 ${
                    isCorrect ? "border-neutral-100" : "border-positive"
                  }`}
                >
                  {/* 질문 폰트: Body/16_md_tighter 스펙 */}
                  <h3 className="text-body-16-md-tighter leading-[1.6] whitespace-pre-line text-neutral-900">
                    {`Q${index + 1}. ${q.question}`}
                  </h3>

                  {/* 보기 목록 */}
                  <div className="flex flex-col gap-2.5">
                    {q.options.map((option) => {
                      const isUserChoice = option.id === q.userAnswerId;
                      const isCorrectAnswer = option.id === q.answerId;

                      let styleClass =
                        "bg-neutral-50/70 border-transparent text-neutral-900";
                      let badgeText = null;
                      let badgeClass = "";

                      if (isCorrect) {
                        if (isUserChoice) {
                          styleClass =
                            "bg-primary-50 border-primary text-primary font-bold";
                          badgeText = "내 정답";
                          badgeClass = "bg-primary text-white";
                        }
                      } else {
                        if (isUserChoice) {
                          styleClass =
                            "bg-positive-50 border-positive text-positive font-bold";
                          badgeText = "내 오답";
                          badgeClass = "bg-positive text-white";
                        } else if (isCorrectAnswer) {
                          styleClass =
                            "bg-primary-50 border-primary text-primary font-bold";
                          badgeText = "정답";
                          badgeClass = "bg-primary text-white";
                        }
                      }

                      return (
                        <div
                          key={option.id}
                          className={`text-body-14-md flex min-h-[52px] items-center justify-between gap-2 rounded-xl border px-4 transition-colors ${styleClass}`}
                        >
                          <span className="min-w-0 flex-1 break-keep">
                            {option.label}
                          </span>
                          {badgeText && (
                            <span
                              className={`text-caption-12-bd shrink-0 rounded-full px-2.5 py-1 ${badgeClass}`}
                            >
                              {badgeText}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* 해설 영역 */}
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
                      {q.explanation}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-5 text-center text-neutral-400">
              퀴즈 데이터가 없습니다.
            </div>
          )}
        </div>
      </div>
    );
  }

  // 2️⃣ 날짜별 퀴즈 복습 목록 화면 (기본 화면)
  return (
    <div className="flex flex-col gap-3 p-5 pb-20">
      {DUMMY_QUIZ_HISTORY.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onSelectHistory(item)}
          className="transition-active flex h-16 w-full cursor-pointer items-center justify-between rounded-xl border border-neutral-100 bg-white px-5 active:bg-neutral-50"
        >
          <span className="text-body-16-bd text-neutral-900">{item.date}</span>
          <div className="text-body-16-bd">
            <span className="text-primary">{item.score}</span>
            <span className="text-neutral-300">/{item.total}</span>
          </div>
        </button>
      ))}
    </div>
  );
}
