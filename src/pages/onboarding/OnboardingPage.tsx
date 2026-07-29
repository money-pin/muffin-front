import { Fragment, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";

import Indicator from "@/components/common/Indicator";
import { saveCharacter } from "@/lib/character";
import { completeOnboarding, saveOnboardingCharacter } from "@/lib/authApi";
import { getMyHome, updateNickname } from "@/lib/mypageApi";
import chevronLeftIcon from "@/assets/icon-28px/chevron-left.svg";
import muffinPlain from "@/assets/avatars/muffin-plain.png";
import muffinSprinkle from "@/assets/avatars/muffin-sprinkle.png";
import muffinButter from "@/assets/avatars/muffin-butter.png";

import {
  ONBOARDING_QUESTIONS,
  ONBOARDING_RESULTS,
  resolveOnboardingResult,
  type OnboardingResultType,
} from "./onboardingData";
import NicknameStep from "./steps/NicknameStep";
import MessageStep from "./steps/MessageStep";
import QuestionStep from "./steps/QuestionStep";
import FeatureStep from "./steps/FeatureStep";
import StartFundCard from "./steps/StartFundCard";

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

// 결과 타입별 캐릭터 이미지
const RESULT_IMAGES: Record<OnboardingResultType, string> = {
  plain: muffinPlain,
  sprinkle: muffinSprinkle,
  butter: muffinButter,
};

// titleTemplate({name}/{char}/\n) → JSX. \n은 <br/>, {char}는 primary 강조.
function renderResultTitle(
  template: string,
  name: string,
  characterName: string,
): ReactNode {
  const lines = template.replace(/{name}/g, name).split("\n");
  return lines.map((line, lineIndex) => {
    const [before, after] = line.split("{char}");
    return (
      <Fragment key={lineIndex}>
        {lineIndex > 0 && <br />}
        {before}
        {after !== undefined && (
          <>
            <span className="text-primary">{characterName}</span>
            {after}
          </>
        )}
      </Fragment>
    );
  });
}

function OnboardingPage() {
  const navigate = useNavigate();
  const [stepIndex, setStepIndex] = useState(0);
  const [nickname, setNickname] = useState("");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const step = STEPS[stepIndex];
  const displayName = nickname.trim() || "회원";
  const progress = PROGRESS[step];

  const goNext = async () => {
    if (stepIndex < STEPS.length - 1) {
      setStepIndex((i) => i + 1);
      return;
    }
    if (isSubmitting) return;

    // 설문으로 정해진 캐릭터를 로컬에 먼저 저장(홈·마이·퀴즈 즉시 공유)
    const muffin = resolveOnboardingResult(answers);
    saveCharacter(muffin);

    // 각 질문에서 선택한 보기 번호(1-based)
    const answerNumber = (questionId: string) => {
      const question = ONBOARDING_QUESTIONS.find((q) => q.id === questionId);
      return question ? question.options.indexOf(answers[questionId]) + 1 : 0;
    };

    // 백엔드는 온보딩 완료(캐릭터 저장 → 완료)를 강제한다.
    // 완료가 실제로 됐는지 mypage/home 200으로 검증한 뒤에만 홈으로 보낸다.
    // 실패하면 홈으로 보내지 않고 에러를 노출해 재시도하게 한다.
    setIsSubmitting(true);
    setSubmitError("");
    try {
      // 이미 캐릭터/완료가 있는 계정은 409로 실패할 수 있으나,
      // 최종 판단은 아래 getMyHome 검증에 맡기고 개별 실패는 삼킨다.
      try {
        await saveOnboardingCharacter({
          muffin,
          firstQuestion: answerNumber("news"),
          secondQuestion: answerNumber("invest"),
          thirdQuestion: answerNumber("goal"),
        });
      } catch {
        // 이미 캐릭터가 있거나 일시 오류 — 완료 검증으로 판단
      }
      try {
        await completeOnboarding();
      } catch {
        // 이미 완료됐을 수 있음 — 완료 검증으로 판단
      }

      // 서버 기준 완료 검증: 온보딩 미완료면 409로 throw됨
      await getMyHome();

      // 완료 확인됨 → 닉네임 저장(실패해도 홈 진입은 막지 않음)
      const trimmedNickname = nickname.trim();
      if (trimmedNickname) {
        try {
          await updateNickname(trimmedNickname);
        } catch {
          // 마이페이지에서 다시 변경 가능
        }
      }

      navigate("/home", { replace: true });
    } catch {
      setSubmitError("온보딩 완료에 실패했어요. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
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
        {/* Figma: welcome 스텝만 뒤로가기 없음 */}
        {step !== "welcome" && (
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
        )}
        {step === "nickname" && (
          <h1 className="text-heading-18-bd pointer-events-none absolute left-1/2 -translate-x-1/2 text-neutral-900">
            닉네임 설정
          </h1>
        )}
      </header>

      {progress && (
        <div className="px-5 pt-1 pb-2">
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
          media={
            <img
              src={muffinPlain}
              alt=""
              aria-hidden="true"
              className="h-[142px] w-[148px] object-contain"
              draggable={false}
            />
          }
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

      {step === "result" &&
        (() => {
          const resultType = resolveOnboardingResult(answers);
          const result = ONBOARDING_RESULTS[resultType];
          return (
            <MessageStep
              media={
                <img
                  src={RESULT_IMAGES[resultType]}
                  alt=""
                  aria-hidden="true"
                  className="h-[142px] w-[148px] object-contain"
                  draggable={false}
                />
              }
              title={renderResultTitle(
                result.titleTemplate,
                displayName,
                result.characterName,
              )}
              subtitle={
                <>
                  비교적 변동성이 적은 '{result.sectors[0]}' 또는
                  <br />'{result.sectors[1]}' 섹터를 추천해요.
                </>
              }
              buttonLabel="다음"
              onNext={goNext}
            >
              <div className="flex w-full items-center gap-4 rounded-[12px] border border-neutral-100 p-4">
                <span className="text-body-14-md text-neutral-700">
                  추천 섹터
                </span>
                <div className="flex items-center gap-2">
                  {result.sectors.map((sector) => (
                    <span
                      key={sector}
                      className="bg-secondary-100 text-body-14-md-tighter text-primary inline-flex min-w-[28px] items-center justify-center rounded-[4px] px-1"
                    >
                      {sector}
                    </span>
                  ))}
                </div>
              </div>
            </MessageStep>
          );
        })()}

      {step === "feature" && <FeatureStep onNext={goNext} />}

      {step === "complete" && (
        <MessageStep
          media={<StartFundCard />}
          title="시작 자금 100만원이 충전되었어요!"
          subtitle={
            <>
              이제 첫 번째 뉴스를 읽고,
              <br />
              {displayName}님의 직감을 구워볼까요?
            </>
          }
          buttonLabel={isSubmitting ? "처리 중..." : "시작하기"}
          onNext={goNext}
        >
          {submitError && (
            <p className="text-body-14-md text-primary text-center">
              {submitError}
            </p>
          )}
        </MessageStep>
      )}
    </div>
  );
}

export default OnboardingPage;
