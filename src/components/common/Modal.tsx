import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { RemoveScroll } from "react-remove-scroll";

import closeIcon from "@/assets/icon-24px/close.svg";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  ariaLabel?: string;

  showCloseButton?: boolean;
  sideOffsetClassName?: string;
  className?: string;
  contentClassName?: string;
  layerClassName?: string;
  trapFocus?: boolean;
}

function Modal({
  isOpen,
  onClose,
  children,
  ariaLabel,
  showCloseButton = false,
  sideOffsetClassName = "px-5",
  className = "rounded-[20px] px-6 py-8",
  contentClassName = "flex flex-col items-center text-center",
  layerClassName = "z-50",
  trapFocus = false,
}: ModalProps) {
  const layerRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!isOpen || !trapFocus) return;
    const layer = layerRef.current;
    const dialog = dialogRef.current;
    if (!layer || !dialog) return;
    const previousFocus = document.activeElement;
    const previousInert = new Map<HTMLElement, boolean>();
    const blockBackground = () => {
      for (const element of document.body.children) {
        if (!(element instanceof HTMLElement) || element.contains(layer))
          continue;
        if (!previousInert.has(element))
          previousInert.set(element, element.inert);
        element.inert = true;
      }
    };
    const getButtons = () =>
      Array.from(
        dialog.querySelectorAll<HTMLElement>(
          'button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter(
        (element) =>
          element.getClientRects().length > 0 && !element.closest("[inert]"),
      );
    const focusInside = () =>
      (getButtons()[0] ?? dialog).focus({ preventScroll: true });
    const onFocus = (event: FocusEvent) => {
      if (event.target instanceof Node && !dialog.contains(event.target))
        focusInside();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      const buttons = getButtons();
      const index = buttons.indexOf(document.activeElement as HTMLElement);
      event.preventDefault();
      const next =
        index < 0
          ? event.shiftKey
            ? buttons.length - 1
            : 0
          : (index + (event.shiftKey ? -1 : 1) + buttons.length) %
            buttons.length;
      (buttons[next] ?? dialog).focus({ preventScroll: true });
    };
    blockBackground();
    const observer = new MutationObserver(blockBackground);
    observer.observe(document.body, { childList: true });
    document.addEventListener("focusin", onFocus, true);
    document.addEventListener("keydown", onKeyDown, true);
    focusInside();
    return () => {
      observer.disconnect();
      document.removeEventListener("focusin", onFocus, true);
      document.removeEventListener("keydown", onKeyDown, true);
      for (const [element, inert] of previousInert) element.inert = inert;
      // 시트가 남아 있으면 배경 대신 시트로 포커스를 돌려준다.
      const underlyingDialog = Array.from(
        document.querySelectorAll<HTMLElement>('[role="dialog"]'),
      )
        .filter(
          (element) => !layer.contains(element) && !element.closest("[inert]"),
        )
        .at(-1);
      if (underlyingDialog) underlyingDialog.focus({ preventScroll: true });
      else if (
        previousFocus instanceof HTMLElement &&
        previousFocus.isConnected &&
        !previousFocus.closest("[inert]")
      ) {
        previousFocus.focus({ preventScroll: true });
      }
    };
  }, [isOpen, trapFocus]);

  if (!isOpen || typeof document === "undefined") return null;

  return createPortal(
    <RemoveScroll>
      <div
        ref={layerRef}
        className={`fixed inset-0 ${layerClassName} flex justify-center bg-black/50`}
      >
        {/* 딤: 프레임 밖(전체화면) — #152 */}
        <div className="relative h-full w-full max-w-[var(--max-width-app)]">
          <div
            className={[
              "relative z-10 flex h-full w-full items-center justify-center",
              sideOffsetClassName,
            ].join(" ")}
          >
            <section
              ref={dialogRef}
              tabIndex={trapFocus ? -1 : undefined}
              role="dialog"
              aria-modal="true"
              aria-label={ariaLabel}
              className={[
                "relative w-full bg-[var(--color-neutral-0)]",
                className,
              ].join(" ")}
            >
              {showCloseButton && (
                <button
                  type="button"
                  onClick={onClose}
                  className="absolute top-5 right-5 z-20 flex h-6 w-6 items-center justify-center"
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
