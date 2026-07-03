import type { ReactNode } from "react";
import chevronLeftIcon from "@/assets/icon-28px/chevron-left.svg";

interface TopBarProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightIcon?: ReactNode;
  background?: "white" | "transparent";
}

export default function TopBar({
  title,
  showBack = false,
  onBack,
  rightIcon,
  background = "white",
}: TopBarProps) {
  const bgClass = background === "transparent" ? "bg-transparent" : "bg-white";

  return (
    <div
      className={`flex h-[56px] items-center justify-between px-5 ${bgClass}`}
    >
      {showBack ? (
        <button
          type="button"
          onClick={onBack}
          className="flex h-7 w-7 shrink-0 items-center justify-center"
          aria-label="뒤로가기"
        >
          <img
            src={chevronLeftIcon}
            alt=""
            aria-hidden="true"
            className="h-7 w-7"
            draggable={false}
          />
        </button>
      ) : (
        <div className="h-7 w-7 shrink-0" />
      )}

      {title && (
        <p className="flex-1 truncate text-center text-heading-18-bd text-neutral-900">
          {title}
        </p>
      )}

      <div className="flex h-7 min-w-7 shrink-0 items-center justify-center">
        {rightIcon ?? <div className="h-7 w-7" />}
      </div>
    </div>
  );
}
