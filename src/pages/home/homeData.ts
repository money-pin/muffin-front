interface GetHomeGreetingMessageParams {
  hasInvestmentHistory: boolean;
  dailyChangeAmount: number;
  isSettlementPending: boolean;
}

export interface HomeGreetingMessageGroups {
  news: readonly string[];
  quiz: readonly string[];
  investment: readonly string[];
  stats: readonly string[];
  character: readonly string[];
  habit: readonly string[];
}

export const HOME_GREETING_MESSAGES = {
  news: [
    "따끈한 금융 소식을 읽어보세요!",
    "오늘은 어떤 금융 소식이 있을까요?",
    "요즘 돈의 흐름, 궁금하지 않아요?",
    "세상이 어떻게 돌아가는지 살펴봐요!",
    "금융 뉴스 하나 읽고 갈까요?",
  ],
  quiz: [
    "오늘의 퀴즈, 풀어볼까요?",
    "금융 상식, 얼마나 알고 있나요?",
    "퀴즈 한 판으로 실력을 확인해봐요!",
    "잠깐! 퀴즈 하나 풀고 가요!",
  ],
  investment: [
    "오늘은 어디에 투자해볼까요?",
    "나만의 투자 전략을 시험해봐요!",
    "오늘의 투자, 시작해볼까요?",
    "내 투자 감각을 시험해볼 시간이에요!",
    "투자 연습도 꾸준히 해봐요!",
  ],
  stats: [
    "내 투자 성적표, 확인해볼까요?",
    "투자 기록이 차곡차곡 쌓이고 있어요!",
    "지금까지의 투자 성과를 확인해봐요!",
  ],
  character: [
    "오늘도 같이 공부해볼까요?",
    "오늘도 한 걸음 성장해봐요!",
    "오늘도 똑똑해지는 중이에요!",
    "금융 공부, 저랑 같이 해요!",
    "흠… 오늘은 뭘 해볼까요?",
  ],
  habit: [
    "돈 공부도 꾸준함이 답이에요!",
    "투자 감각은 하루아침에 생기지 않아요!",
    "아는 만큼 보이는 게 금융이에요!",
    "오늘의 금융 지식, 한 스푼 추가!",
    "오늘도 똑똑한 투자 습관을 만들어봐요!",
  ],
} as const satisfies HomeGreetingMessageGroups;

export function getHomeGreetingMessage({
  hasInvestmentHistory,
  dailyChangeAmount,
  isSettlementPending,
}: GetHomeGreetingMessageParams) {
  if (isSettlementPending) return "다음 투자도 기대해봐요!";
  if (!hasInvestmentHistory) return "오늘의 투자를 시작해볼까요?";
  if (dailyChangeAmount > 0) return "투자 성과가 아주 좋아요!";
  if (dailyChangeAmount < 0) return "괜찮아요, 다음 기회를 노려봐요..";
  return "꾸준히 잘하고 있어요!";
}
