import { useState, useEffect } from "react";

interface ScrollToTopButtonProps {
  onClick?: () => void;
}

export default function ScrollToTopButton({ onClick }: ScrollToTopButtonProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    if (onClick) {
      onClick();
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // onClick props가 주어지면 부모가 직접 표시 상태를 제어하고 있으므로, 
  // props가 없을 때만 자체 window 스크롤 상태(isVisible)를 기준으로 반환 처리를 합니다.
  if (!onClick && !isVisible) return null;

  return (
    <button
      type="button"
      onClick={scrollToTop}
      className="fixed bottom-[100px] right-5 z-50 flex h-[40px] w-[40px] items-center justify-center rounded-full bg-white shadow-[0_0_4px_0_rgba(0,0,0,0.25)] transition-opacity duration-200 hover:opacity-90"
      aria-label="맨 위로 이동"
    >
      <svg
        width="12"
        height="16"
        viewBox="0 0 12 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M6 15L6 1M6 1L1 6M6 1L11 6"
          stroke="#999999"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}