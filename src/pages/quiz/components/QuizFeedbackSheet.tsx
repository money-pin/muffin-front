import Button from "@/components/common/Button";

interface QuizFeedbackSheetProps {
  isCorrect: boolean;
  answerLabel: string;
  explanation: string;
  isLast: boolean;
  onNext: () => void;
}

// Figma Quiz Section(정답/오답 바텀시트): 결과 문구(20bd) + (오답 시 정답 표시)
// + 해설 카드(전구 아이콘 + 14md 라벨 + 16rg 본문) + 다음 문제
export default function QuizFeedbackSheet({
  isCorrect,
  answerLabel,
  explanation,
  isLast,
  onNext,
}: QuizFeedbackSheetProps) {
  return (
    <div className="fixed bottom-0 left-1/2 z-40 w-full max-w-[var(--max-width-app)] -translate-x-1/2 rounded-t-[20px] bg-white px-5 pt-6 pb-[42px] shadow-[0px_0px_8px_rgba(0,0,0,0.2)]">
      <div className="flex items-center gap-1">
        <span className="flex h-6 w-6 items-center justify-center">
          <svg
            aria-hidden="true"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
          >
            <circle
              cx="10"
              cy="10"
              r="10"
              fill={isCorrect ? "var(--color-green)" : "var(--color-positive)"}
            />
            {isCorrect ? (
              <path
                d="M5.5 10.5l3 3 6-6.5"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ) : (
              <path
                d="M6.8 6.8l6.4 6.4M13.2 6.8l-6.4 6.4"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
              />
            )}
          </svg>
        </span>
        <p
          className={`text-heading-20-bd ${isCorrect ? "text-green" : "text-positive"}`}
        >
          {isCorrect ? "정답이에요!" : "오답이에요!"}
        </p>
      </div>

      {!isCorrect && (
        <p className="text-body-16-md-tighter mt-3 text-neutral-900">
          정답: {answerLabel}
        </p>
      )}

      <div className="mt-4 rounded-[12px] border border-neutral-100 bg-white p-4">
        <div className="flex items-center gap-1">
          <svg
            aria-hidden="true"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--color-neutral-600)"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 18h6" />
            <path d="M10 21h4" />
            <path d="M12 3a6 6 0 0 1 3.5 10.9c-.7.5-1 1.3-1 2.1h-5c0-.8-.3-1.6-1-2.1A6 6 0 0 1 12 3Z" />
          </svg>
          <p className="text-body-14-md-tighter text-neutral-600">해설</p>
        </div>
        <p className="text-body-16-rg-tighter mt-2 text-neutral-900">
          {explanation}
        </p>
      </div>

      <Button onClick={onNext} className="mt-4">
        {isLast ? "결과 보기" : "다음 문제"}
      </Button>
    </div>
  );
}
