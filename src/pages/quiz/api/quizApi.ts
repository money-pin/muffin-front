import { apiRequest } from "@/lib/api";

import type { QuizAttemptResult, QuizResult, TodayQuizResult } from "./types";

// 오늘의 퀴즈 조회 (문제/보기)
export function getTodayQuiz() {
  return apiRequest<TodayQuizResult>("/api/quizzes/today", { auth: true });
}

// 퀴즈 문항 답 제출 → 정답/해설/진행도 반환
export function submitQuizAttempt(quizId: number, optionId: number) {
  return apiRequest<QuizAttemptResult>(`/api/quizzes/${quizId}/attempt`, {
    method: "POST",
    body: { optionId },
    auth: true,
  });
}

// 오늘 퀴즈 결과 조회 (완료 후)
export function getQuizResult() {
  return apiRequest<QuizResult>("/api/quizzes/today/result", { auth: true });
}
