import Button from "@/components/common/Button";
import giftIcon from "@/assets/bi_gift-fill.svg";

interface QuizResultViewProps {
  correctCount: number;
  total: number;
  reward: number;
  onGoHome: () => void;
}

function getResultMessage(correctCount: number, total: number) {
  if (correctCount === total) return "완벽해요!";
  if (correctCount === 0) return "아쉬워요!";
  return "잘하셨어요!";
}

// Figma 퀴즈 결과: 원형 게이지(정답 비율) + 보상 카드 + 홈으로
export default function QuizResultView({
  correctCount,
  total,
  reward,
  onGoHome,
}: QuizResultViewProps) {
  const size = 180;
  const strokeWidth = 18;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = circumference * (correctCount / total);

  return (
    <div className="flex min-h-[calc(100dvh-118px)] flex-col px-5 pb-12">
      <div className="flex flex-col items-center pt-10">
        <div className="relative" style={{ width: size, height: size }}>
          <svg width={size} height={size} className="-rotate-90">
            <defs>
              <linearGradient id="quiz-gauge" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="var(--color-secondary)" />
                <stop offset="100%" stopColor="var(--color-primary)" />
              </linearGradient>
            </defs>
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="var(--color-neutral-50)"
              strokeWidth={strokeWidth}
            />
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="url(#quiz-gauge)"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={`${progress} ${circumference}`}
            />
          </svg>
          <p className="absolute inset-0 flex items-center justify-center text-heading-28-md font-bold text-primary">
            {correctCount}/{total}
          </p>
        </div>

        <p className="mt-6 text-heading-20-bd text-neutral-900">
          {getResultMessage(correctCount, total)}
        </p>
        <p className="mt-2 text-center text-body-14-md text-neutral-400">
          {total}문제 중 {correctCount}문제를 맞히셨어요.
          {reward > 0 && (
            <>
              <br />
              보상으로 투자금 {reward.toLocaleString("ko-KR")}원을 드려요.
            </>
          )}
        </p>
      </div>

      {reward > 0 && (
        <div className="mt-8 flex flex-col">
          {/* 보상 획득 탭: 카드 왼쪽에서 12px 들여쓰고 카드 상단에 붙는 라운드 탭 */}
          <div className="flex px-3">
            <div className="flex h-7 items-center justify-center gap-2 rounded-t-[8px] bg-secondary-100 px-2">
              <img
                src={giftIcon}
                alt=""
                aria-hidden="true"
                className="h-4 w-4"
              />
              <span className="text-body-14-bd text-primary">보상 획득!</span>
            </div>
          </div>
          {/* 보상 금액 카드 */}
          <div className="flex w-full items-center justify-center rounded-[12px] border border-neutral-100 bg-white p-6">
            <p className="text-heading-28-md text-primary">
              +{reward.toLocaleString("ko-KR")} 원
            </p>
          </div>
        </div>
      )}

      <div className="mt-auto">
        <Button onClick={onGoHome}>홈으로 돌아가기</Button>
      </div>
    </div>
  );
}
