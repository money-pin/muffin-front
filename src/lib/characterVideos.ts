import type { CharacterVariant } from "./character";

import plainQuiz from "@/assets/videos/plain-quiz.mp4";
import sprinkleQuiz from "@/assets/videos/sprinkle-quiz.mp4";
import creamQuiz from "@/assets/videos/cream-quiz.mp4";
import butterQuiz from "@/assets/videos/butter-quiz.mp4";

import onboardingStart from "@/assets/videos/onboarding-start.mp4";
import plainOnboarding from "@/assets/videos/plain-onboarding.mp4";
import sprinkleOnboarding from "@/assets/videos/sprinkle-onboarding.mp4";
import butterOnboarding from "@/assets/videos/butter-onboarding.mp4";

// 온보딩 시작(welcome) 화면: 캐릭터가 정해지기 전이라 캐릭터 무관 단일 영상
export const ONBOARDING_START_VIDEO = onboardingStart;

// 퀴즈 시작 화면: 캐릭터 4종(생크림 포함)
export const QUIZ_CHARACTER_VIDEOS: Record<CharacterVariant, string> = {
  plain: plainQuiz,
  sprinkle: sprinkleQuiz,
  cream: creamQuiz,
  butter: butterQuiz,
};

// 온보딩: 온보딩에서 정해지는 3종(생크림은 온보딩 결과에 없음)
export const ONBOARDING_CHARACTER_VIDEOS: Record<
  "plain" | "sprinkle" | "butter",
  string
> = {
  plain: plainOnboarding,
  sprinkle: sprinkleOnboarding,
  butter: butterOnboarding,
};
