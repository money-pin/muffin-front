import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";

import closeIcon from "@/assets/icon-24px/close.svg";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;

  showCloseButton?: boolean;
  className?: string;
  contentClassName?: string;
}

function Modal({
  isOpen,
  onClose,
  children,
  showCloseButton = false,
  className = "w-[350px] rounded-[20px] px-6 py-8",
  contentClassName = "flex flex-col items-center text-center",
}: ModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  if (!isOpen || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[var(--color-neutral-1000)]/50"
      />

      <section
        role="dialog"
        aria-modal="true"
        className={[
          "relative z-10 bg-[var(--color-neutral-0)]",
          className,
        ].join(" ")}
      >
        {showCloseButton && (
          <button
            type="button"
            onClick={onClose}
            className="absolute right-5 top-5 flex h-6 w-6 items-center justify-center"
            aria-label="모달 닫기"
          >
            <img src={closeIcon} alt="" className="h-6 w-6" />
          </button>
        )}

        <div className={contentClassName}>{children}</div>
      </section>
    </div>,
    document.body,
  );
}

export default Modal;
