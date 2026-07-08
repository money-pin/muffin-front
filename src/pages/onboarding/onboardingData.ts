export interface OnboardingQuestion {
  id: string;
  question: string;
  options: string[];
}

// Figma 온보딩 설문 (Q1~Q3)
export const ONBOARDING_QUESTIONS: OnboardingQuestion[] = [
  {
    id: "news",
    question: "평소 경제 뉴스를 얼마나 보시나요?",
    options: ["거의 안 봐요", "가끔 봐요", "매일 챙겨봐요"],
  },
  {
    id: "invest",
    question: "투자 경험이 있으신가요?",
    options: ["처음이에요", "조금 해봤어요", "주식 고수예요"],
  },
  {
    id: "goal",
    question: "머핀에서 무엇을 이루고 싶은가요?",
    options: ["경제 공부", "가벼운 재미", "데일리 루프 형성"],
  },
];
