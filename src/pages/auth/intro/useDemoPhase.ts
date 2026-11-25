import { useEffect, useState } from "react";

import { prefersReducedMotion } from "@/lib/motion";

// 마지막 단계를 보여준 뒤 처음부터 다시 돌기 전 머무는 시간과, 사라지는 시간 (#335)
const LOOP_HOLD_MS = 2200;
export const LOOP_FADE_MS = 400;

interface DemoPhase {
  phase: number;
  // 몇 번째 반복인지. key로 써서 반복할 때마다 데모를 처음 상태로 다시 그린다
  cycle: number;
  // 다음 반복 직전, 데모가 흐려지며 사라지는 중
  isLeaving: boolean;
}

// 소개 화면 데모 애니메이션 단계. delays[i]ms 뒤에 i+1단계로 넘어가고,
// 마지막 단계에서 잠시 머문 뒤 흐려졌다가 처음부터 반복한다 (Figma 프로토타입처럼 계속 재생).
// 동작 줄이기 설정이면 애니메이션 없이 reducedPhase 단계를 바로 보여준다.
export function useDemoPhase(
  delays: readonly number[],
  reducedPhase: number,
): DemoPhase {
  const [state, setState] = useState<DemoPhase>(() => ({
    phase: prefersReducedMotion() ? reducedPhase : 0,
    cycle: 0,
    isLeaving: false,
  }));
  const { cycle } = state;

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const timers = delays.map((delay, index) =>
      window.setTimeout(
        () => setState((current) => ({ ...current, phase: index + 1 })),
        delay,
      ),
    );
    const lastDelay = delays.at(-1) ?? 0;
    timers.push(
      window.setTimeout(
        () => setState((current) => ({ ...current, isLeaving: true })),
        lastDelay + LOOP_HOLD_MS,
      ),
      window.setTimeout(
        () =>
          setState((current) => ({
            phase: 0,
            cycle: current.cycle + 1,
            isLeaving: false,
          })),
        lastDelay + LOOP_HOLD_MS + LOOP_FADE_MS,
      ),
    );
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [delays, cycle]);

  return state;
}
