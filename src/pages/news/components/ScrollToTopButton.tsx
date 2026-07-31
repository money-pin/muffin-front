import arrowUpIcon from "@/assets/icon-24px/arrow-up.svg";

interface ScrollToTopButtonProps {
  onClick?: () => void;
  className?: string;
}

export default function ScrollToTopButton({
  onClick,
  className = "",
}: ScrollToTopButtonProps) {
  const scrollToTop = () => {
    if (onClick) {
      onClick();
      return;
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
