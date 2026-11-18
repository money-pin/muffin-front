import type { TodayQuizResult } from "@/pages/quiz/api/types";

export interface InvestmentCompletion {
  isEdit: boolean;
  dateKey: string;
}

export type InvestmentQuizPromptVariant = "not-started" | "in-progress";

export function shouldCheckInvestmentQuiz(
  completion: InvestmentCompletion | null,
  todayDateKey: string,
) {
  return (
    completion !== null &&
    !completion.isEdit &&
    completion.dateKey === todayDateKey
  );
}

export function getInvestmentQuizPromptVariant(
  quiz: TodayQuizResult,
): InvestmentQuizPromptVariant | null {
  if (quiz.quizSetStatus !== "PUBLISHED" || quiz.questions.length === 0)
    return null;
  if (quiz.sessionStatus === "NOT_STARTED") return "not-started";
  if (quiz.sessionStatus === "PROGRESS") return "in-progress";
  return null;
}

export const INVESTMENT_QUIZ_PROMPT_COPY = {
  "not-started": {
    title: "아직 퀴즈를 풀지 않았어요!",
    description: "퀴즈를 풀고 최대 30만 원을 더 받아 투자해 보세요!",
    action: "퀴즈 풀기",
  },
  "in-progress": {
    title: "아직 퀴즈를 전부 풀지 않았어요!",
    description: "남은 퀴즈를 풀고 투자금을 받아보세요!",
    action: "이어서 풀기",
  },
} satisfies Record<
  InvestmentQuizPromptVariant,
  { title: string; description: string; action: string }
>;
