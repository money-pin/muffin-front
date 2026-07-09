import Button from "@/components/common/Button";

interface QuizCompletedViewProps {
  onGoHome: () => void;
}

// Figma 퀴즈 완료 상태: 하루 1회 제한 안내 (다음 퀴즈는 아침 9시 오픈)
export default function QuizCompletedView({ onGoHome }: QuizCompletedViewProps) {
  return (
    <div className="flex min-h-[calc(100dvh-118px)] flex-col px-5 pb-12">
      <div className="flex flex-1 flex-col items-center justify-center">
        <div
          aria-hidden="true"
          className="flex h-24 w-24 items-center justify-center rounded-full bg-neutral-50"
        >
          <svg
            width="44"
            height="44"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--color-neutral-400)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 12.5l5 5L20 6.5" />
          </svg>
        </div>

        <p className="mt-8 text-heading-20-bd text-neutral-900">
          오늘은 이미 퀴즈를 완료했어요!
        </p>
        <p className="mt-3 text-center text-body-14-md text-neutral-600">
          <span className="text-body-14-bd text-primary">내일 아침 9시</span>에
          새로운 퀴즈로
          <br />
          다시 도전할 수 있어요.
        </p>
      </div>

      <Button onClick={onGoHome}>홈으로 돌아가기</Button>
    </div>
  );
}
