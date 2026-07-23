interface ScrollToTopButtonProps {
  onClick?: () => void;
}

export default function ScrollToTopButton({ onClick }: ScrollToTopButtonProps) {
  const scrollToTop = () => {
    if (onClick) {
      onClick();
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-white shadow-[0_0_8px_0_rgba(0,0,0,0.2)] transition-opacity duration-200 hover:opacity-90"
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