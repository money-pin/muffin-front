import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

import type { TopBarOutletContext } from "@/layouts/TopBarLayout";
import { characterTypeToVariant, type CharacterVariant } from "@/lib/character";
import { mypageQueryKeys, useMyHomeQuery } from "@/lib/mypageQueries";
import QuizIntro from "@/pages/quiz/components/QuizIntro";
import QuizQuestionView from "@/pages/quiz/components/QuizQuestionView";
import QuizFeedbackSheet from "@/pages/quiz/components/QuizFeedbackSheet";
import QuizResultView from "@/pages/quiz/components/QuizResultView";
import QuizCompletedView from "@/pages/quiz/components/QuizCompletedView";
import {
  useQuizResultQuery,
  useSubmitQuizAttemptMutation,
  useTodayQuizQuery,
} from "@/pages/quiz/api/queries";
import type { QuizAttemptResult } from "@/pages/quiz/api/types";

type QuizPhase = "intro" | "question" | "result";

function QuizStateMessage({
  children,
  onRetry,
}: {
  children: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex min-h-[calc(100dvh-56px)] flex-col items-center justify-center gap-4 px-5">
      <p className="text-body-14-md text-center whitespace-pre-line text-neutral-400">
        {children}
      </p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="text-body-14-bd text-primary"
        >
          다시 시도
        </button>
      )}
    </div>
  );
}

function QuizPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { setTopBar, resetTopBar } = useOutletContext<TopBarOutletContext>();

  const [phase, setPhase] = useState<QuizPhase>("intro");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [attempt, setAttempt] = useState<QuizAttemptResult | null>(null);

  const todayQuizQuery = useTodayQuizQuery();
  const submitAttemptMutation = useSubmitQuizAttemptMutation();

  // 닉네임·캐릭터는 홈·마이와 동일한 공유 캐시(useMyHomeQuery)에서 렌더 중 직접 파생한다.
  // (기존엔 로컬 state + getMyHome 직접 호출이라 재진입 시 plain/빈값 → 실제값 플래시가 있었음)
  const myHomeQuery = useMyHomeQuery();
  const nickname = myHomeQuery.data?.nickname ?? "";
  const character: CharacterVariant = myHomeQuery.data?.character
    ? characterTypeToVariant(myHomeQuery.data.character.characterType)
    : "plain";

  const questions = todayQuizQuery.data?.questions ?? [];
  const alreadyFinished = todayQuizQuery.data?.sessionStatus === "FINISHED";

  // 결과는 결과 화면이거나 이미 완료된 경우에만 조회
  const resultQuery = useQuizResultQuery(phase === "result" || alreadyFinished);

  useEffect(() => {
    setTopBar({
      title: "오늘의 한 입 퀴즈",
      showBack: true,
      onBack: () => navigate("/home"),
    });
    return resetTopBar;
  }, [setTopBar, resetTopBar, navigate]);

  const goHome = () => navigate("/home");

  // 재진입(PROGRESS)이면 인트로는 그대로 두고 시작 버튼 문구만 바꾼다.
  const isResume = todayQuizQuery.data?.sessionStatus === "PROGRESS";

  // 인트로 "시작" 시 진입 위치를 정한다. 재진입이면 이어 풀 문항(nextQuestionOrder,
  // 1-indexed)에 해당하는 quizOrder 위치부터, 아니면 0번부터 시작.
  const handleStart = () => {
    const data = todayQuizQuery.data;
    if (isResume && data) {
      const resumeOrder = data.progress?.nextQuestionOrder ?? 1;
      const resumeIndex = data.questions.findIndex(
        (question) => question.quizOrder === resumeOrder,
      );
      setQuestionIndex(resumeIndex >= 0 ? resumeIndex : 0);
    }
    setPhase("question");
  };

  if (todayQuizQuery.isLoading || myHomeQuery.isLoading) {
    return <QuizStateMessage>퀴즈를 불러오는 중입니다.</QuizStateMessage>;
  }
  if (todayQuizQuery.isError) {
    return (
      <QuizStateMessage onRetry={() => todayQuizQuery.refetch()}>
        오늘의 퀴즈를 불러오지 못했어요. 잠시 후 다시 시도해주세요.
      </QuizStateMessage>
    );
  }

  // 이미 오늘 완료한 경우 (결과 화면 진행 중이 아니면 완료 화면)
  // FINISHED면 questions가 빈 배열로 오므로 아래 빈 상태 체크보다 먼저 처리한다.
  if (alreadyFinished && phase !== "result") {
    return <QuizCompletedView onGoHome={goHome} />;
  }

  // 아직 문제를 받지 못한 경우 (미발행/생성 중 등)
  if (questions.length === 0 && phase !== "result") {
    return (
      <QuizStateMessage>
        {"오늘의 퀴즈를 준비하고 있어요.\n오전 10시부터 풀 수 있어요."}
      </QuizStateMessage>
    );
  }

  if (phase === "intro") {
    return (
      <QuizIntro
        nickname={nickname}
        character={character}
        startLabel={isResume ? "남은 퀴즈 계속하기" : "퀴즈 시작하기"}
        onStart={handleStart}
        onLater={goHome}
      />
    );
  }

  if (phase === "result") {
    // 결과 응답이 온 뒤에만 결과 화면을 보여줘 보상 0원 깜빡임을 방지
    if (resultQuery.isLoading) {
      return <QuizStateMessage>결과를 불러오는 중입니다.</QuizStateMessage>;
    }
    if (resultQuery.isError || !resultQuery.data) {
      return (
        <QuizStateMessage onRetry={() => resultQuery.refetch()}>
          결과를 불러오지 못했어요. 잠시 후 다시 시도해주세요.
        </QuizStateMessage>
      );
    }
    const { progress, reward } = resultQuery.data;
    return (
      <QuizResultView
        correctCount={progress.correctCount}
        total={progress.totalCount}
        reward={reward.amount}
        onGoHome={goHome}
      />
    );
  }

  // question phase
  const currentQuestion = questions[questionIndex];
  const submitted = attempt !== null;

  // 기존 QuizQuestionView가 쓰는 shape로 매핑 (정답/해설은 제출 응답에서 채움)
  const viewQuestion = {
    id: currentQuestion.quizId,
    question: currentQuestion.question,
    options: currentQuestion.options.map((option) => ({
      id: String(option.optionId),
      label: option.content,
    })),
    answerId: attempt ? String(attempt.correctOptionId) : "",
    explanation: attempt?.explanation ?? "",
  };

  const answerLabel =
    currentQuestion.options.find(
      (option) => option.optionId === attempt?.correctOptionId,
    )?.content ?? "";

  const handleSubmit = () => {
    if (selectedId === null || submitAttemptMutation.isPending) return;
    submitAttemptMutation.mutate(
      { quizId: currentQuestion.quizId, optionId: Number(selectedId) },
      {
        onSuccess: (data) => {
          setAttempt(data);
          // 마지막 문제까지 풀면 오늘 학습 참여로 기록되므로, 스트릭이 걸린
          // 마이/홈 캐시(mypage/home)를 무효화해 요일 색칠이 바로 반영되게 한다.
          if (data.isLastQuestion) {
            queryClient.invalidateQueries({
              queryKey: mypageQueryKeys.home(),
            });
          }
        },
      },
    );
  };

  const handleNext = () => {
    if (attempt?.isLastQuestion) {
      setPhase("result");
      return;
    }
    setQuestionIndex((index) => index + 1);
    setSelectedId(null);
    setAttempt(null);
  };

  return (
    <>
      <QuizQuestionView
        question={viewQuestion}
        index={questionIndex}
        total={questions.length}
        selectedId={selectedId}
        submitted={submitted}
        isSubmitting={submitAttemptMutation.isPending}
        submitError={
          submitAttemptMutation.isError
            ? "제출에 실패했어요. 잠시 후 다시 시도해주세요."
            : undefined
        }
        onSelect={setSelectedId}
        onSubmit={handleSubmit}
      />
      {submitted && attempt && (
        <QuizFeedbackSheet
          isCorrect={attempt.isCorrect}
          answerLabel={answerLabel}
          explanation={attempt.explanation}
          isLast={attempt.isLastQuestion}
          onNext={handleNext}
        />
      )}
    </>
  );
}

export default QuizPage;
