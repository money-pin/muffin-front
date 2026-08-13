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

// 온보딩 결과(추천 캐릭터) 분기
// 명세: 뉴스(3) x 투자경험(3) x 목표(3) = 27가지 조합 → 3개 머핀으로 분기.
// 목표 질문은 결과에 영향 없음. (플레인 15 / 버터빛 9 / 스프링클 3)
export type OnboardingResultType = "plain" | "sprinkle" | "butter";

export interface OnboardingResult {
  characterName: string; // primary 컬러로 강조되는 머핀 이름
  // {name}=닉네임, {char}=characterName(강조), \n=줄바꿈. Figma 시안 줄바꿈 위치 반영.
  titleTemplate: string;
  sectors: [string, string]; // 추천 섹터 칩
}

export const ONBOARDING_RESULTS: Record<OnboardingResultType, OnboardingResult> =
  {
    plain: {
      characterName: "플레인 머핀",
      titleTemplate: "투자가 서툰 {name}님을 위해\n{char}이 함께해요!",
      sectors: ["달러", "금"],
    },
    sprinkle: {
      characterName: "스프링클 머핀",
      titleTemplate:
        "투자 경험을 바탕으로 더 넓은 기회를\n찾을 {name}님을 위해\n{char}이 함께해요!",
      sectors: ["금융", "테크"],
    },
    butter: {
      characterName: "버터빛 머핀",
      titleTemplate:
        "차근차근 투자 감각을 키워갈\n{name}님을 위해\n{char}이 함께해요!",
      sectors: ["반도체", "방산"],
    },
  };

// 답변 조합 → 결과 타입
// - 뉴스 "거의 안 봐요"(NEVER) 또는 투자 "처음이에요"(BEGINNER) → 플레인
// - 뉴스 "매일 챙겨봐요"(DAILY) 그리고 투자 "주식 고수예요"(EXPERT) → 스프링클
// - 그 외 → 버터빛
export function resolveOnboardingResult(
  answers: Record<string, string>,
): OnboardingResultType {
  const newsOptions =
    ONBOARDING_QUESTIONS.find((q) => q.id === "news")?.options ?? [];
  const investOptions =
    ONBOARDING_QUESTIONS.find((q) => q.id === "invest")?.options ?? [];

  const newsNever = answers.news === newsOptions[0];
  const newsDaily = answers.news === newsOptions[2];
  const investBeginner = answers.invest === investOptions[0];
  const investExpert = answers.invest === investOptions[2];

  if (newsNever || investBeginner) return "plain";
  if (newsDaily && investExpert) return "sprinkle";
  return "butter";
}
