import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import { RemoveScroll } from "react-remove-scroll";

import closeIcon from "@/assets/icon-24px/close.svg";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;

  showCloseButton?: boolean;
  sideOffsetClassName?: string;
  className?: string;
  contentClassName?: string;
}

function Modal({
  isOpen,
  onClose,
  children,
  showCloseButton = false,
  sideOffsetClassName = "px-5",
  className = "rounded-[20px] px-6 py-8",
  contentClassName = "flex flex-col items-center text-center",
}: ModalProps) {
  if (!isOpen || typeof document === "undefined") return null;

  return createPortal(
    <RemoveScroll>
      <div className="fixed inset-0 z-50 flex justify-center">
        <div className="relative h-full w-full max-w-[var(--max-width-app)]">
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[var(--color-neutral-1000)]/50"
          />

          <div
            className={[
              "relative z-10 flex h-full w-full items-center justify-center",
              sideOffsetClassName,
            ].join(" ")}
          >
            <section
              role="dialog"
              aria-modal="true"
              className={[
                "relative w-full bg-[var(--color-neutral-0)]",
                className,
              ].join(" ")}
            >
              {showCloseButton && (
                <button
                  type="button"
                  onClick={onClose}
                  className="absolute top-5 right-5 flex h-6 w-6 items-center justify-center"
                  aria-label="모달 닫기"
                >
                  <img src={closeIcon} alt="" className="h-6 w-6" />
                </button>
              )}

              <div className={contentClassName}>{children}</div>
            </section>
          </div>
        </div>
      </div>
    </RemoveScroll>,
    document.body,
  );
}

export default Modal;