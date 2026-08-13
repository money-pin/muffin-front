import { useEffect, useState, type RefObject } from "react";
import arrowUpIcon from "@/assets/icon-24px/arrow-up.svg";

const SHOW_THRESHOLD = 300;

interface ScrollToTopButtonProps {
  onClick?: () => void;
  className?: string;
  // 스크롤 위치를 관찰할 컨테이너. 없으면 window 스크롤만 관찰한다.
  // 이 앱은 window 스크롤이 기본이라, 컨테이너 스크롤을 쓰는 화면만 넘기면 된다.
  scrollTargetRef?: RefObject<HTMLElement | null>;
  // 노출 기준 스크롤 거리(px). 기본 300.
  threshold?: number;
}

export default function ScrollToTopButton({
  onClick,
  className = "",
  scrollTargetRef,
  threshold = SHOW_THRESHOLD,
}: ScrollToTopButtonProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const target = scrollTargetRef?.current ?? null;

    const getScrollTop = () =>
      Math.max(
        target?.scrollTop ?? 0,
        window.scrollY,
        document.documentElement.scrollTop,
      );

    const update = () => setIsVisible(getScrollTop() > threshold);

    update(); // 초기 위치 반영
    window.addEventListener("scroll", update, { passive: true });
    target?.addEventListener("scroll", update, { passive: true });

    return () => {
      window.removeEventListener("scroll", update);
      target?.removeEventListener("scroll", update);
    };
  }, [scrollTargetRef, threshold]);

  const scrollToTop = () => {
    if (onClick) {
      onClick();
      return;
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!isVisible) return null;

  return (
    <button
      type="button"
      onClick={scrollToTop}
      className={`bg-neutral-0 flex size-10 items-center justify-center rounded-full p-1 shadow-[0_0_4px_0_rgba(0,0,0,0.25)] transition-opacity duration-200 hover:opacity-90 ${className}`}
      aria-label="맨 위로 이동"
    >
      <img
        src={arrowUpIcon}
        alt=""
        aria-hidden="true"
        className="size-6 object-contain"
        draggable={false}
      />
    </button>
  );
}
