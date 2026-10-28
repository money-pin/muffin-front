import chevronLeftIcon from "@/assets/icon-28px/chevron-left.svg";
import giftIcon from "@/assets/bi_gift-fill.svg";
import QuizStepIndicator from "@/pages/quiz/components/QuizStepIndicator";

import PhoneMockup from "./PhoneMockup";
import { useDemoPhase } from "./useDemoPhase";

// 0: 문제 → 1: 보기 선택 → 2: 오답 해설 시트 → 3: 결과 화면
const PHASE_DELAYS = [1200, 2000, 4200] as const;
const REDUCED_PHASE = 2;

const OPTIONS = ["상장지수펀드", "개인종합자산관리계좌", "퇴직연금"] as const;
const SELECTED_OPTION = 1;

// 결과 게이지 (퀴즈 결과 화면과 같은 규격)
const GAUGE_SIZE = 180;
const GAUGE_STROKE = 18;
const GAUGE_RADIUS = (GAUGE_SIZE - GAUGE_STROKE) / 2;
const GAUGE_CIRCUMFERENCE = 2 * Math.PI * GAUGE_RADIUS;

function QuizHeader({ showBack }: { showBack: boolean }) {
  return (
    <header className="relative mt-[62px] flex h-14 items-center justify-between px-5">
      {showBack ? (
        <img
          src={chevronLeftIcon}
          alt=""
          className="size-7"
          draggable={false}
        />
      ) : (
        <span className="size-7" />
      )}
      <p className="text-heading-18-bd text-neutral-900">오늘의 한 입 퀴즈</p>
      <span className="size-7" />
    </header>
  );
}

function WrongIcon() {
  return (
    <svg
      aria-hidden="true"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
    >
      <circle cx="10" cy="10" r="10" fill="var(--color-positive)" />
      <path
        d="M6.8 6.8l6.4 6.4M13.2 6.8l-6.4 6.4"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function BulbIcon() {
  return (
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
  );
}

function QuestionScreen({ phase }: { phase: number }) {
  const isSelected = phase >= 1;
  const showFeedback = phase >= 2;

  return (
    <div className="bg-neutral-0 relative h-[844px] overflow-hidden">
      <div className="to-neutral-0 absolute inset-x-0 top-0 h-[726px] bg-gradient-to-b from-[rgba(254,243,225,0.5)] to-[61%]" />
      <QuizHeader showBack />

      <div className="relative mt-7 px-5">
        <QuizStepIndicator total={3} currentIndex={0} />
        <p className="text-heading-20-md text-neutral-1000 mt-4 tracking-[-0.8px]">
          오늘 뉴스에 나온 ETF는
          <br />
          무엇의 약자일까요?
        </p>

        <div className="mt-10 flex flex-col gap-3">
          {OPTIONS.map((option, index) => {
            const active = isSelected && index === SELECTED_OPTION;
            return (
              <div
                key={option}
                className={`w-full rounded-[8px] border py-4 text-center transition-colors duration-300 ${
                  active
                    ? "border-primary-300 bg-primary-50 text-body-16-bd-tighter text-primary"
                    : "bg-neutral-0 text-body-16-md-tighter border-neutral-100 text-neutral-900"
                }`}
              >
                {option}
              </div>
            );
          })}
        </div>
      </div>

      <div
        className={`bg-positive-50 absolute inset-x-0 bottom-[230px] rounded-t-[20px] px-5 pt-6 pb-[42px] transition-transform duration-500 ease-out ${
          showFeedback ? "translate-y-0" : "translate-y-[calc(100%+230px)]"
        }`}
      >
        <div className="flex items-center gap-1">
          <WrongIcon />
          <p className="text-heading-20-bd text-positive">오답이에요!</p>
        </div>
        <p className="text-body-16-md-tighter mt-3 text-neutral-900">
          정답: 상장지수펀드 (Exchange Traded Fund)
        </p>
        <div className="bg-neutral-0 mt-4 rounded-[12px] border border-neutral-50 p-4">
          <div className="flex items-center gap-1">
            <BulbIcon />
            <p className="text-body-14-md-tighter text-neutral-600">해설</p>
          </div>
          <p className="text-body-16-rg-tighter mt-2 leading-[1.5] text-neutral-900">
            ETF는 주식처럼 거래소에서 사고팔 수 있는 펀드를 말해요.
          </p>
        </div>
        <div className="bg-primary text-body-16-bd-tighter text-neutral-0 mt-4 flex h-[52px] items-center justify-center rounded-[12px]">
          다음 문제
        </div>
      </div>
    </div>
  );
}

function ResultScreen() {
  const progress = GAUGE_CIRCUMFERENCE * (2 / 3);

  return (
    <div className="bg-neutral-0 relative h-[844px]">
      <div className="to-neutral-0 absolute inset-x-0 top-0 h-[726px] bg-gradient-to-b from-[rgba(254,243,225,0.5)] to-[61%]" />
      <QuizHeader showBack={false} />

      <div className="relative mt-10 flex flex-col items-center">
        <div
          className="relative"
          style={{ width: GAUGE_SIZE, height: GAUGE_SIZE }}
        >
          <svg width={GAUGE_SIZE} height={GAUGE_SIZE} className="-rotate-90">
            <defs>
              <linearGradient id="intro-quiz-gauge" x1="1" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="var(--color-secondary-400)" />
                <stop offset="100%" stopColor="var(--color-primary)" />
              </linearGradient>
            </defs>
            <circle
              cx={GAUGE_SIZE / 2}
              cy={GAUGE_SIZE / 2}
              r={GAUGE_RADIUS}
              fill="none"
              stroke="var(--color-neutral-50)"
              strokeWidth={GAUGE_STROKE}
            />
            <circle
              cx={GAUGE_SIZE / 2}
              cy={GAUGE_SIZE / 2}
              r={GAUGE_RADIUS}
              fill="none"
              stroke="url(#intro-quiz-gauge)"
              strokeWidth={GAUGE_STROKE}
              strokeLinecap="round"
              strokeDasharray={GAUGE_CIRCUMFERENCE}
              strokeDashoffset={GAUGE_CIRCUMFERENCE - progress}
            />
          </svg>
          <p className="text-heading-28-md text-primary absolute inset-0 flex items-center justify-center font-bold">
            2/3
          </p>
        </div>

        <p className="text-heading-20-md text-neutral-1000 mt-5">잘하셨어요!</p>
        <p className="text-body-16-rg-tighter mt-2 text-center text-neutral-600">
          3문제 중 2문제를 맞히셨어요.
          <br />
          보상으로 투자금 200,000원을 드려요.
        </p>
      </div>

      <div className="relative mt-10 flex flex-col px-5">
        <div className="flex px-3">
          <div className="bg-secondary-100 flex h-7 items-center justify-center gap-2 rounded-t-[8px] px-2">
            <img src={giftIcon} alt="" className="size-4" draggable={false} />
            <span className="text-body-14-bd text-primary">보상 획득!</span>
          </div>
        </div>
        <div className="bg-neutral-0 flex w-full items-center justify-center rounded-[12px] border border-neutral-100 p-6">
          <p className="text-heading-28-md text-primary">+200,000 원</p>
        </div>
      </div>
    </div>
  );
}

// 소개 2: "오늘 구운 뉴스 퀴즈로 복습해요" — 퀴즈 풀이 → 해설 → 보상 미리보기
export default function QuizDemo() {
  const phase = useDemoPhase(PHASE_DELAYS, REDUCED_PHASE);
  const showResult = phase >= 3;

  return (
    <PhoneMockup className="top-[215px] h-[675px] rounded-[30px]">
      <div className="relative">
        <QuestionScreen phase={phase} />
        <div
          className={`absolute inset-0 transition-opacity duration-500 ${
            showResult ? "opacity-100" : "opacity-0"
          }`}
        >
          <ResultScreen />
        </div>
      </div>
    </PhoneMockup>
  );
}
