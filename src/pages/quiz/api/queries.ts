import { useMutation, useQuery } from "@tanstack/react-query";

import { getQuizResult, getTodayQuiz, submitQuizAttempt } from "./quizApi";

export const quizQueryKeys = {
  all: ["quiz"] as const,
  today: () => [...quizQueryKeys.all, "today"] as const,
  result: () => [...quizQueryKeys.all, "result"] as const,
};

export function useTodayQuizQuery() {
  return useQuery({
    queryKey: quizQueryKeys.today(),
    queryFn: getTodayQuiz,
    retry: false,
  });
}

export function useQuizResultQuery(enabled = true) {
  return useQuery({
    queryKey: quizQueryKeys.result(),
    queryFn: getQuizResult,
    enabled,
    retry: false,
  });
}

export function useSubmitQuizAttemptMutation() {
  return useMutation({
    mutationFn: ({ quizId, optionId }: { quizId: number; optionId: number }) =>
      submitQuizAttempt(quizId, optionId),
  });
}
