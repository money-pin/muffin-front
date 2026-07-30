import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

import type { TopBarOutletContext } from "@/layouts/TopBarLayout";
import { getMyHome } from "@/lib/mypageApi";
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
      <p className="text-body-14-md text-center text-neutral-500">{children}</p>
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
  const { setTopBar, resetTopBar } = useOutletContext<TopBarOutletContext>();

  const [nickname, setNickname] = useState("");
  const [phase, setPhase] = useState<QuizPhase>("intro");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [attempt, setAttempt] = useState<QuizAttemptResult | null>(null);

  const todayQuizQuery = useTodayQuizQuery();
  const submitAttemptMutation = useSubmitQuizAttemptMutation();

  const questions = todayQuizQuery.data?.questions ?? [];
  const alreadyFinished = todayQuizQuery.data?.sessionStatus === "FINISHED";

  // 결과는 결과 화면이거나 이미 완료된 경우에만 조회
  const resultQuery = useQuizResultQuery(phase === "result" || alreadyFinished);

  useEffect(() => {
    setTopBar({ title: "오늘의 한 입 퀴즈" });
    return resetTopBar;
  }, [setTopBar, resetTopBar]);

  // 인트로 문구에 쓸 닉네임 (홈·마이와 동일하게 서버 조회)
  useEffect(() => {
    let active = true;
    getMyHome()
      .then((home) => {
        if (active) setNickname(home.nickname);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const goHome = () => navigate("/home");

  if (todayQuizQuery.isLoading) {
    return <QuizStateMessage>퀴즈를 불러오는 중입니다.</QuizStateMessage>;
  }
  if (todayQuizQuery.isError || questions.length === 0) {
    return (
      <QuizStateMessage>
        오늘의 퀴즈를 아직 불러올 수 없어요. 잠시 후 다시 시도해주세요.
      </QuizStateMessage>
    );
  }

  // 이미 오늘 완료한 경우 (결과 화면 진행 중이 아니면 완료 화면)
  if (alreadyFinished && phase !== "result") {
    return <QuizCompletedView onGoHome={goHome} />;
  }

  if (phase === "intro") {
    return (
      <QuizIntro
        nickname={nickname}
        onStart={() => setPhase("question")}
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
      { onSuccess: (data) => setAttempt(data) },
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
