import { useState, type ReactNode } from "react";

import Logo from "@/components/common/Logo";
import muffinPlain from "@/assets/avatars/muffin-plain.png";
import muffinButter from "@/assets/avatars/muffin-butter.png";
import muffinSprinkle from "@/assets/avatars/muffin-sprinkle.png";
import muffinCream from "@/assets/avatars/muffin-cream.png";
import SocialAuthSheet from "../components/SocialAuthSheet";

import BriefingDemo from "./BriefingDemo";
import IntroIndicator from "./IntroIndicator";
import InvestDemo from "./InvestDemo";
import QuizDemo from "./QuizDemo";

const SLIDES: { title: [string, string]; demo: () => ReactNode }[] = [
  {
    title: ["경제 뉴스, 이제", "1분이면 충분해요"],
    demo: () => <BriefingDemo />,
  },
  { title: ["오늘 구운 뉴스", "퀴즈로 복습해요"], demo: () => <QuizDemo /> },
  {
    title: ["100만원으로 시작하는", "나의 첫 투자"],
    demo: () => <InvestDemo />,
  },
];

const LAST_SLIDE = SLIDES.length - 1;

// 마지막 화면: 로고 + 머핀 4종 위로 회원가입 시트 (Figma 머핀 간격 80px, 줄 너비 326px)
function SignupScreen() {
  return (
    <main className="from-neutral-0 to-secondary-200 flex h-dvh flex-col items-center bg-gradient-to-b from-[40.5%] to-[60.4%]">
      <div className="mt-[224px] flex flex-col items-center gap-[34px]">
        <Logo size="lg" />
        <div aria-hidden="true" className="flex">
          <img
            src={muffinPlain}
            alt=""
            className="w-[86px]"
            draggable={false}
          />
          <img
            src={muffinButter}
            alt=""
            className="mt-[7px] -ml-1.5 w-[86px]"
            draggable={false}
          />
          <img
            src={muffinSprinkle}
            alt=""
            className="-ml-1.5 w-[86px] -rotate-[8.4deg]"
            draggable={false}
          />
          <img
            src={muffinCream}
            alt=""
            className="mt-[7px] -ml-1.5 w-[86px]"
            draggable={false}
          />
        </div>
      </div>
    </main>
  );
}

// 서비스 소개 (Figma 런칭 전 수정: 온보딩1~3) → 마지막에 회원가입 시트
function IntroPage() {
  const [slideIndex, setSlideIndex] = useState(0);
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  const handleNext = () => {
    if (slideIndex < LAST_SLIDE) {
      setSlideIndex((index) => index + 1);
      return;
    }
    setIsSignupOpen(true);
  };

  if (isSignupOpen) {
    return (
      <>
        <SignupScreen />
        {/* 시트를 닫으면 마지막 소개 화면으로 돌아가 다시 [다음]으로 열 수 있게 한다 */}
        <SocialAuthSheet
          isOpen
          onClose={() => setIsSignupOpen(false)}
          mode="signup"
        />
      </>
    );
  }

  const slide = SLIDES[slideIndex];

  return (
    <main className="from-neutral-0 to-secondary-200 relative h-dvh overflow-hidden bg-gradient-to-t from-[13%] to-[87%]">
      <h1 className="text-heading-20-bd text-neutral-1000 relative z-10 px-5 pt-[110px] text-center">
        {slide.title[0]}
        <br />
        {slide.title[1]}
      </h1>

      {/* key로 슬라이드마다 다시 마운트해 데모 애니메이션을 처음부터 재생 */}
      <div key={slideIndex}>{slide.demo()}</div>

      <div className="absolute inset-x-0 bottom-[34px] z-10 flex h-[68px] items-center justify-between px-5 py-2">
        <IntroIndicator total={SLIDES.length} current={slideIndex} />
        <button
          type="button"
          onClick={handleNext}
          className="bg-primary text-body-16-bd-tighter text-neutral-0 h-[52px] rounded-[12px] px-5"
        >
          다음
        </button>
      </div>
    </main>
  );
}

export default IntroPage;
