export interface QuizOption {
  id: string;
  label: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: QuizOption[];
  answerId: string;
  explanation: string;
}

// 화면 구현 확인용 임시 값 — 실제 데이터는 추후 API 연동 시 반영
export const QUIZ_USER = {
  nickname: "예은",
};

// Figma 결과 화면: 2문제 정답 → 200,000원 (문제당 100,000원)
export const QUIZ_REWARD_PER_CORRECT = 100_000;

// 오늘 퀴즈 완료 여부 — API 연동 전 임시 플래그
export const HAS_COMPLETED_TODAY = false;

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "오늘 뉴스에 나온 ETF는\n무엇의 약자일까요?",
    options: [
      { id: "etf", label: "상장지수펀드 (Exchange Traded Fund)" },
      { id: "isa", label: "개인종합자산관리계좌 (ISA)" },
      { id: "irp", label: "퇴직연금 (IRP)" },
    ],
    answerId: "etf",
    explanation: "ETF는 주식처럼 거래소에서 사고팔 수 있는 펀드를 말해요.",
  },
  {
    id: 2,
    question:
      "반도체 수출 실적이 사상 최대를 기록했다는 뉴스가 떴어요! 어떤 섹터에 베팅하는 게 유리할까요?",
    options: [
      { id: "semiconductor", label: "반도체/IT 섹터" },
      { id: "commodity", label: "원자재(금/은) 섹터" },
    ],
    answerId: "semiconductor",
    explanation:
      "수출 호재는 기업의 수익으로 이어져 해당 섹터의 지수를 높일 확률이 커요.",
  },
  {
    id: 3,
    question: "기준금리가 인하되면\n채권 가격은 보통 어떻게 될까요?",
    options: [
      { id: "up", label: "오른다" },
      { id: "down", label: "내린다" },
    ],
    answerId: "up",
    explanation:
      "금리가 내리면 이미 발행된 채권의 이자 매력이 커져서 가격이 오르는 경향이 있어요.",
  },
];
