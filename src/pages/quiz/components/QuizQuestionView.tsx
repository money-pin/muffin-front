import Button from "@/components/common/Button";
import QuizStepIndicator from "@/pages/quiz/components/QuizStepIndicator";
import type { QuizQuestion } from "@/pages/quiz/quizData";

interface QuizQuestionViewProps {
  question: QuizQuestion;
  index: number;
  total: number;
  selectedId: string | null;
  submitted: boolean;
  isSubmitting?: boolean;
  submitError?: string;
  onSelect: (optionId: string) => void;
  onSubmit: () => void;
}

// Figma 퀴즈 문제: 스텝 인디케이터 + 질문 + 선택지 + 제출하기
// 제출 후: 정답은 초록(green), 내가 고른 오답은 빨강(positive) 하이라이트
export default function QuizQuestionView({
  question,
  index,
  total,
  selectedId,
  submitted,
  isSubmitting = false,
  submitError,
  onSelect,
  onSubmit,
}: QuizQuestionViewProps) {
  const getOptionClass = (optionId: string) => {
    const isSelected = optionId === selectedId;
    const isAnswer = optionId === question.answerId;

    if (submitted) {
      // 정답은 초록(green), 내가 고른 오답은 빨강(positive)
      if (isAnswer) return "border-green bg-green-50 text-green";
      if (isSelected) return "border-positive bg-positive-50 text-positive";
      return "border-neutral-100 bg-white text-neutral-900";
    }
    if (isSelected) return "border-primary bg-primary-50 text-primary";
    return "border-neutral-100 bg-white text-neutral-900";
  };

  return (
    <div className="flex min-h-[calc(100dvh-56px)] flex-col px-5 pb-12">
      <QuizStepIndicator total={total} currentIndex={index} />

      <p className="text-heading-20-bd mt-4 whitespace-pre-line text-neutral-900">
        {question.question}
      </p>

      <div className="mt-7 flex flex-col gap-3">
        {question.options.map((option) => (
          <button
            key={option.id}
            type="button"
            disabled={submitted}
            onClick={() => onSelect(option.id)}
            className={`text-body-16-md-tighter flex min-h-[56px] w-full items-center justify-center rounded-[12px] border px-4 transition-colors ${getOptionClass(option.id)}`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {!submitted && (
        <div className="mt-auto">
          {submitError && (
            <p className="text-body-14-md text-positive mb-3 text-center">
              {submitError}
            </p>
          )}
          <Button
            onClick={onSubmit}
            disabled={selectedId === null || isSubmitting}
          >
            {isSubmitting ? "제출 중..." : "제출하기"}
          </Button>
        </div>
      )}
    </div>
  );
}
