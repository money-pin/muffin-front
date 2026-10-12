import { useEffect, useState } from "react";

import { prefersReducedMotion } from "@/lib/motion";

// 소개 화면 데모 애니메이션 단계. delays[i]ms 뒤에 i+1단계로 넘어간다.
// 동작 줄이기 설정이면 애니메이션 없이 reducedPhase 단계를 바로 보여준다.
export function useDemoPhase(delays: readonly number[], reducedPhase: number) {
  const [phase, setPhase] = useState(() =>
    prefersReducedMotion() ? reducedPhase : 0,
  );

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const timers = delays.map((delay, index) =>
      window.setTimeout(() => setPhase(index + 1), delay),
    );
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [delays]);

  return phase;
}
