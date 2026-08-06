// 데일리 퀴즈 API 타입 (Swagger 기준)

export type QuizSetStatus =
  "GENERATING" | "READY" | "PUBLISHED" | "UNAVAILABLE" | (string & {});

export type QuizSessionStatus =
  "NOT_STARTED" | "PROGRESS" | "FINISHED" | (string & {});

export interface QuizApiOption {
  optionId: number;
  optionOrder: number;
  content: string;
}

export interface QuizApiQuestion {
  quizId: number;
  quizOrder: number;
  question: string;
  options: QuizApiOption[];
}

export interface QuizProgress {
  totalCount: number;
  solvedCount: number;
  correctCount: number;
  nextQuestionOrder: number;
}

// GET /api/quizzes/today — 문제/보기만 내려오고 정답·해설은 없음.
// progress로 진행도(이어 풀 문항)를 함께 내려줘 재진입 시 이어풀기에 사용한다.
export interface TodayQuizResult {
  quizSetStatus: QuizSetStatus;
  sessionStatus: QuizSessionStatus;
  progress: QuizProgress;
  questions: QuizApiQuestion[];
}

// POST /api/quizzes/{quizId}/attempt — 제출 시 정답·해설·진행도 반환
export interface QuizAttemptResult {
  isCorrect: boolean;
  correctOptionId: number;
  explanation: string;
  selectedOptionId: number;
  sessionStatus: QuizSessionStatus;
  isLastQuestion: boolean;
  progress: QuizProgress;
}

// GET /api/quizzes/today/result — 완료 전 접근 시 409 QUIZ_409_001
export interface QuizResult {
  quizDate: string;
  sessionStatus: QuizSessionStatus;
  progress: {
    totalCount: number;
    correctCount: number;
    incorrectCount: number;
  };
  reward: {
    amount: number;
    claimed: boolean;
  };
}

// ── 지난 퀴즈 복습 (GET /api/quizzes/history, /history/{date}) ──
export interface QuizHistorySummary {
  quizDate: string;
  totalCount: number;
  correctCount: number;
  incorrectCount: number;
}

export interface QuizHistoryList {
  histories: QuizHistorySummary[];
}

export interface QuizHistoryOption {
  optionId: number;
  optionOrder: number;
  content: string;
  isSelected: boolean;
  isCorrect: boolean;
}

export interface QuizHistoryQuestion {
  quizId: number;
  questionOrder: number;
  question: string;
  isCorrect: boolean;
  selectedOptionId: number;
  correctOptionId: number;
  options: QuizHistoryOption[];
  explanation: string;
}

export interface QuizHistoryDetail {
  quizDate: string;
  summary: {
    totalCount: number;
    correctCount: number;
    incorrectCount: number;
  };
  questions: QuizHistoryQuestion[];
}
