import { useMutation, useQuery } from "@tanstack/react-query";

import {
  getQuizHistory,
  getQuizHistoryDetail,
  getQuizResult,
  getTodayQuiz,
  submitQuizAttempt,
} from "./quizApi";

export const quizQueryKeys = {
  all: ["quiz"] as const,
  today: () => [...quizQueryKeys.all, "today"] as const,
  result: () => [...quizQueryKeys.all, "result"] as const,
  history: () => [...quizQueryKeys.all, "history"] as const,
  historyDetail: (date: string) =>
    [...quizQueryKeys.all, "history", date] as const,
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

export function useQuizHistoryQuery() {
  return useQuery({
    queryKey: quizQueryKeys.history(),
    queryFn: getQuizHistory,
    retry: false,
  });
}

export function useQuizHistoryDetailQuery(date: string | null) {
  return useQuery({
    queryKey: quizQueryKeys.historyDetail(date ?? ""),
    queryFn: () => getQuizHistoryDetail(date as string),
    enabled: date !== null,
    retry: false,
  });
}

export function useSubmitQuizAttemptMutation() {
  return useMutation({
    mutationFn: ({ quizId, optionId }: { quizId: number; optionId: number }) =>
      submitQuizAttempt(quizId, optionId),
  });
}
