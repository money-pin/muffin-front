import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Indicator from "@/components/common/Indicator";
import chevronLeftIcon from "@/assets/icon-28px/chevron-left.svg";

import { ONBOARDING_QUESTIONS } from "./onboardingData";
import NicknameStep from "./steps/NicknameStep";
import MessageStep from "./steps/MessageStep";
import QuestionStep from "./steps/QuestionStep";
import FeatureStep from "./steps/FeatureStep";

// 온보딩 스텝 순서 (question-N 은 ONBOARDING_QUESTIONS 인덱스)
const STEPS = [
  "nickname",
  "welcome",
  "question-0",
  "question-1",
  "question-2",
  "result",
  "feature",
  "complete",
] as const;

type Step = (typeof STEPS)[number];

// 진행바(6칸)를 노출하는 스텝과 현재 위치
const PROGRESS: Partial<Record<Step, number>> = {
  "question-0": 1,
  "question-1": 2,
  "question-2": 3,
  result: 4,
  feature: 5,
  complete: 6,
};
const PROGRESS_TOTAL = 6;

function OnboardingPage() {
  const navigate = useNavigate();
  const [stepIndex, setStepIndex] = useState(0);
  const [nickname, setNickname] = useState("");
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const step = STEPS[stepIndex];
  const displayName = nickname.trim() || "회원";
  const progress = PROGRESS[step];

  const goNext = () => {
    if (stepIndex < STEPS.length - 1) {
      setStepIndex((i) => i + 1);
    } else {
      navigate("/home", { replace: true });
    }
  };

  const goBack = () => {
    if (stepIndex > 0) {
      setStepIndex((i) => i - 1);
    } else {
      navigate(-1);
    }
  };

  const questionIndex = step.startsWith("question-")
    ? Number(step.split("-")[1])
    : -1;

  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <header className="relative flex h-14 shrink-0 items-center px-5">
        <button
          type="button"
          onClick={goBack}
          aria-label="뒤로가기"
          className="flex h-7 w-7 items-center justify-center"
        >
          <img
            src={chevronLeftIcon}
            alt=""
            aria-hidden="true"
            className="h-7 w-7"
            draggable={false}
          />
        </button>
        {step === "nickname" && (
          <h1 className="pointer-events-none absolute left-1/2 -translate-x-1/2 text-heading-18-bd text-neutral-900">
            닉네임 설정
          </h1>
        )}
      </header>

      {progress && (
        <div className="px-5 pb-2 pt-1">
          <Indicator total={PROGRESS_TOTAL} current={progress} />
        </div>
      )}

      {step === "nickname" && (
        <NicknameStep
          nickname={nickname}
          onChange={setNickname}
          onNext={goNext}
        />
      )}

      {step === "welcome" && (
        <MessageStep
          title={`반가워요, ${displayName}님!`}
          subtitle={
            <>
              경제에 대한 관심도와 경험을 알아보기 위해
              <br />
              간단한 몇 가지 질문을 준비했어요.
            </>
          }
          buttonLabel="계속하기"
          onNext={goNext}
        />
      )}

      {questionIndex >= 0 &&
        (() => {
          const question = ONBOARDING_QUESTIONS[questionIndex];
          return (
            <QuestionStep
              number={questionIndex + 1}
              question={question}
              selected={answers[question.id]}
              onSelect={(option) =>
                setAnswers((prev) => ({ ...prev, [question.id]: option }))
              }
              onNext={goNext}
            />
          );
        })()}

      {step === "result" && (
        <MessageStep
          title={
            <>
              투자가 서툰 {displayName}님을 위해
              <br />
              <span className="text-primary">플레인 머핀</span>이 함께해요!
            </>
          }
          subtitle={
            <>
              비교적 변동성이 적은 '반도체' 또는
              <br />
              '금' 섹터를 추천해요.
            </>
          }
          buttonLabel="다음"
          onNext={goNext}
        >
          <div className="mt-4 flex items-center gap-2 rounded-full border border-neutral-100 px-3 py-2">
            <span className="text-body-14-md text-neutral-600">추천 섹터</span>
            <span className="rounded-full bg-primary-50 px-2.5 py-1 text-body-14-bd text-primary">
              반도체
            </span>
            <span className="rounded-full bg-primary-50 px-2.5 py-1 text-body-14-bd text-primary">
              금
            </span>
          </div>
        </MessageStep>
      )}

      {step === "feature" && <FeatureStep onNext={goNext} />}

      {step === "complete" && (
        <MessageStep
          title="시작 자금 100만원이 충전되었어요!"
          subtitle={
            <>
              이제 첫 번째 뉴스를 읽고,
              <br />
              {displayName}님의 직감을 구워볼까요?
            </>
          }
          buttonLabel="시작하기"
          onNext={goNext}
        />
      )}
    </div>
  );
}

export default OnboardingPage;
