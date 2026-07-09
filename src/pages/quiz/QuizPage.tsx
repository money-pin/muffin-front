import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

import type { TopBarOutletContext } from "@/layouts/TopBarLayout";
import QuizIntro from "@/pages/quiz/components/QuizIntro";
import QuizQuestionView from "@/pages/quiz/components/QuizQuestionView";
import QuizFeedbackSheet from "@/pages/quiz/components/QuizFeedbackSheet";
import QuizResultView from "@/pages/quiz/components/QuizResultView";
import QuizCompletedView from "@/pages/quiz/components/QuizCompletedView";
import {
  HAS_COMPLETED_TODAY,
  QUIZ_QUESTIONS,
  QUIZ_REWARD_PER_CORRECT,
  QUIZ_USER,
} from "@/pages/quiz/quizData";

type QuizPhase = "intro" | "question" | "result" | "completed";

function QuizPage() {
  const navigate = useNavigate();
  const { setTopBar, resetTopBar } = useOutletContext<TopBarOutletContext>();

  const [phase, setPhase] = useState<QuizPhase>(
    HAS_COMPLETED_TODAY ? "completed" : "intro",
  );
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);

  useEffect(() => {
    setTopBar({ title: "오늘의 한 입 퀴즈" });
    return resetTopBar;
  }, [setTopBar, resetTopBar]);

  const question = QUIZ_QUESTIONS[questionIndex];
  const isLast = questionIndex === QUIZ_QUESTIONS.length - 1;
  const isCorrect = selectedId === question.answerId;

  const handleSubmit = () => {
    if (selectedId === null) return;
    setSubmitted(true);
    if (selectedId === question.answerId) {
      setCorrectCount((count) => count + 1);
    }
  };

  const handleNext = () => {
    if (isLast) {
      setPhase("result");
      return;
    }
    setQuestionIndex((index) => index + 1);
    setSelectedId(null);
    setSubmitted(false);
  };

  const goHome = () => navigate("/home");

  if (phase === "completed") {
    return <QuizCompletedView onGoHome={goHome} />;
  }

  if (phase === "intro") {
    return (
      <QuizIntro
        nickname={QUIZ_USER.nickname}
        onStart={() => setPhase("question")}
        onLater={goHome}
      />
    );
  }

  if (phase === "result") {
    return (
      <QuizResultView
        correctCount={correctCount}
        total={QUIZ_QUESTIONS.length}
        reward={correctCount * QUIZ_REWARD_PER_CORRECT}
        onGoHome={goHome}
      />
    );
  }

  return (
    <>
      <QuizQuestionView
        question={question}
        index={questionIndex}
        total={QUIZ_QUESTIONS.length}
        selectedId={selectedId}
        submitted={submitted}
        onSelect={setSelectedId}
        onSubmit={handleSubmit}
      />
      {submitted && (
        <QuizFeedbackSheet
          isCorrect={isCorrect}
          answerLabel={
            question.options.find((option) => option.id === question.answerId)
              ?.label ?? ""
          }
          explanation={question.explanation}
          isLast={isLast}
          onNext={handleNext}
        />
      )}
    </>
  );
}

export default QuizPage;
