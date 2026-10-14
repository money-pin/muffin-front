// OS의 '동작 줄이기' 설정. 켜져 있으면 자동 애니메이션 대신 최종 상태를 바로 보여준다.
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
