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

// GET /api/quizzes/today — 문제/보기만 내려오고 정답·해설은 없음
export interface TodayQuizResult {
  quizSetStatus: QuizSetStatus;
  sessionStatus: QuizSessionStatus;
  questions: QuizApiQuestion[];
}

export interface QuizProgress {
  totalCount: number;
  solvedCount: number;
  correctCount: number;
  nextQuestionOrder: number;
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
