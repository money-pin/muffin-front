import Button from "@/components/common/Button";

interface QuizFeedbackSheetProps {
  isCorrect: boolean;
  answerLabel: string;
  explanation: string;
  isLast: boolean;
  onNext: () => void;
}

// Figma 정답/오답 바텀시트: 결과 문구 + (오답 시 정답 표시) + 해설 카드 + 다음 문제
export default function QuizFeedbackSheet({
  isCorrect,
  answerLabel,
  explanation,
  isLast,
  onNext,
}: QuizFeedbackSheetProps) {
  return (
    <div className="fixed bottom-0 left-1/2 z-40 w-full max-w-[390px] -translate-x-1/2 rounded-t-[24px] bg-white px-5 pb-10 pt-6 shadow-[0px_-3px_7px_rgba(0,0,0,0.1)]">
      <div className="flex items-center gap-2">
        <span
          aria-hidden="true"
          className={`flex h-5 w-5 items-center justify-center rounded-full text-caption-12-bd text-white ${
            isCorrect ? "bg-primary" : "bg-positive"
          }`}
        >
          {isCorrect ? "✓" : "✕"}
        </span>
        <p
          className={`text-heading-18-bd ${isCorrect ? "text-primary" : "text-positive"}`}
        >
          {isCorrect ? "정답이에요!" : "오답이에요!"}
        </p>
      </div>

      {!isCorrect && (
        <p className="mt-3 text-body-16-md-tighter text-neutral-900">
          정답: {answerLabel}
        </p>
      )}

      <div className="mt-3 rounded-[12px] border border-neutral-100 bg-white p-4">
        <p className="text-caption-12-md text-neutral-400">💡 해설</p>
        <p className="mt-1.5 text-body-14-md text-neutral-900">{explanation}</p>
      </div>

      <Button onClick={onNext} className="mt-4">
        {isLast ? "결과 보기" : "다음 문제"}
      </Button>
    </div>
  );
}
