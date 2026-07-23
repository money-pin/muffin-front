import { QUIZ_QUESTIONS, type QuizQuestion } from "@/pages/quiz/quizData";

export interface ReviewQuestion extends QuizQuestion {
  userAnswerId: string;
}

export interface QuizHistoryItem {
  id: string;
  date: string;
  score: number;
  total: number;
  questions: ReviewQuestion[];
}

export const DUMMY_QUIZ_HISTORY: QuizHistoryItem[] = [
  {
    id: "1",
    date: "2026-05-06",
    score: 2,
    total: 3,
    questions: [
      { ...QUIZ_QUESTIONS[0], userAnswerId: "etf" },
      { ...QUIZ_QUESTIONS[1], userAnswerId: "semiconductor" },
      { ...QUIZ_QUESTIONS[2], userAnswerId: "down" },
    ],
  },
  {
    id: "2",
    date: "2026-05-07",
    score: 3,
    total: 3,
    questions: [
      { ...QUIZ_QUESTIONS[0], userAnswerId: "etf" },
      { ...QUIZ_QUESTIONS[1], userAnswerId: "semiconductor" },
      { ...QUIZ_QUESTIONS[2], userAnswerId: "up" },
    ],
  },
  {
    id: "3",
    date: "2026-05-08",
    score: 1,
    total: 3,
    questions: [
      { ...QUIZ_QUESTIONS[0], userAnswerId: "isa" },
      { ...QUIZ_QUESTIONS[1], userAnswerId: "semiconductor" },
      { ...QUIZ_QUESTIONS[2], userAnswerId: "down" },
    ],
  },
];