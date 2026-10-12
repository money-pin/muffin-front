import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from "@/components/common/Button";
import Logo from "@/components/common/Logo";
import MuffinVideo from "@/components/common/MuffinVideo";
import { ONBOARDING_START_VIDEO } from "@/lib/characterVideos";
import { prefersReducedMotion } from "@/lib/motion";
import SocialAuthSheet from "./components/SocialAuthSheet";

const BUBBLE_TEXT = "오늘 코스피는 왜 내렸을까?";
const TYPING_START_DELAY_MS = 600;
const TYPING_INTERVAL_MS = 90;

// 말풍선 문구를 한 글자씩 노출한다. 모션 최소화 설정이면 바로 전체 문구를 보여준다.
function useTypewriter(text: string) {
  const [count, setCount] = useState(() =>
    prefersReducedMotion() ? text.length : 0,
  );

  useEffect(() => {
    if (count >= text.length) return;

    const timer = window.setTimeout(
      () => setCount((current) => current + 1),
      count === 0 ? TYPING_START_DELAY_MS : TYPING_INTERVAL_MS,
    );
    return () => window.clearTimeout(timer);
  }, [count, text.length]);

  return text.slice(0, count);
}

function SpeechBubble() {
  const typedText = useTypewriter(BUBBLE_TEXT);

  return (
    <div
      className="relative drop-shadow-[0_1px_2.5px_rgba(0,0,0,0.14)]"
      aria-label={BUBBLE_TEXT}
    >
      <div className="bg-neutral-0 flex h-[38px] items-end rounded-[8px] px-4 py-2">
        <span
          aria-hidden="true"
          className="text-body-14-md-tighter text-neutral-1000 whitespace-nowrap"
        >
          {typedText}
        </span>
        <span
          aria-hidden="true"
          className="bg-primary mb-[5px] ml-0.5 h-0.5 w-2 animate-pulse rounded-full"
        />
      </div>
      <span
        aria-hidden="true"
        className="border-t-neutral-0 absolute top-full left-1/2 -mt-px -translate-x-1/2 border-x-[14px] border-t-[12px] border-x-transparent"
      />
    </div>
  );
}

// 시작 화면 (Figma 런칭 전 수정: 온보딩0)
// [시작하기] → 서비스 소개, [로그인하기] → 소셜 로그인 시트
function StartPage() {
  const navigate = useNavigate();
  const [isLoginSheetOpen, setIsLoginSheetOpen] = useState(false);

  return (
    // 배경: 화면 아래쪽에서 퍼지는 복숭아빛 원형 그라데이션 (Figma 온보딩 배경)
    <main className="flex min-h-dvh flex-col bg-[radial-gradient(circle_540px_at_50%_60%,#ffffff_52%,#ffffff_60%,#f8d4bc_100%)]">
      {/* Figma 844px 기준 캐릭터 그룹 상단이 205px에 오도록 위쪽 여백을 둔다 */}
      <div className="flex flex-1 flex-col items-center justify-center pt-[17dvh] pb-6">
        <SpeechBubble />
        <MuffinVideo
          src={ONBOARDING_START_VIDEO}
          className="mt-[15px] size-[200px]"
        />

        <div className="mt-[85px] flex flex-col items-center gap-4">
          <Logo size="md" />
          <p className="text-body-16-md-tighter text-neutral-600">
            매일 가볍게 즐기는 금융 핀셋 가이드
          </p>
        </div>
      </div>

      <div className="px-5 py-2">
        <Button onClick={() => navigate("/intro")}>시작하기</Button>
      </div>

      <div className="mb-[34px] flex h-[46px] items-center justify-center gap-2 px-5">
        <span className="text-body-14-md-tighter text-neutral-400">
          이미 계정이 있나요?
        </span>
        <button
          type="button"
          onClick={() => setIsLoginSheetOpen(true)}
          className="text-body-14-bd text-primary underline"
        >
          로그인하기
        </button>
      </div>

      <SocialAuthSheet
        isOpen={isLoginSheetOpen}
        onClose={() => setIsLoginSheetOpen(false)}
        mode="login"
      />
    </main>
  );
}

export default StartPage;
