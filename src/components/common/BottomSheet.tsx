import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

const ANIMATION_DURATION_MS = 300;

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  ariaLabel: string;
  children: ReactNode;
}

export default function BottomSheet({
  isOpen,
  onClose,
  ariaLabel,
  children,
}: BottomSheetProps) {
  const [isMounted, setIsMounted] = useState(isOpen);
  const [isVisible, setIsVisible] = useState(false);
  const sheetRef = useRef<HTMLElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    let frame = 0;
    let unmountTimer = 0;

    if (isOpen) {
      frame = window.requestAnimationFrame(() => {
        setIsMounted(true);
      });
    } else {
      frame = window.requestAnimationFrame(() => {
        setIsVisible(false);
        // transitionend가 발생하지 않는 경우를 대비한 unmount fallback
        unmountTimer = window.setTimeout(() => {
          setIsMounted(false);
        }, ANIMATION_DURATION_MS);
      });
    }

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(unmountTimer);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !isMounted) return;

    const frame = window.requestAnimationFrame(() => {
      setIsVisible(true);
    });

    return () => window.cancelAnimationFrame(frame);
  }, [isOpen, isMounted]);

  useEffect(() => {
    if (!isMounted) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMounted]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen || !isMounted) return;

    if (!previousFocusRef.current) {
      previousFocusRef.current =
        document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null;
    }

    const frame = window.requestAnimationFrame(() => {
      sheetRef.current?.focus();
    });

    return () => window.cancelAnimationFrame(frame);
  }, [isOpen, isMounted]);

  useEffect(() => {
    if (isMounted) return;

    previousFocusRef.current?.focus();
    previousFocusRef.current = null;
  }, [isMounted]);

  useEffect(() => {
    return () => previousFocusRef.current?.focus();
  }, []);

  if (!isMounted || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div
        aria-hidden="true"
        className={`absolute inset-0 bg-neutral-1000/50 transition-opacity duration-300 ${
          isVisible ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />

      <section
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        tabIndex={-1}
        onTransitionEnd={(event) => {
          if (
            !isOpen &&
            event.target === event.currentTarget &&
            event.propertyName === "transform"
          ) {
            setIsMounted(false);
          }
        }}
        className={`relative z-10 flex max-h-[100dvh] w-full max-w-[450px] flex-col overflow-hidden rounded-t-[20px] bg-neutral-0 outline-none transition-transform duration-300 ease-out ${
          isVisible ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div
          aria-hidden="true"
          className="flex shrink-0 justify-center pt-4"
        >
          <div className="h-1 w-12 rounded-full bg-neutral-100" />
        </div>

        {children}
      </section>
    </div>,
    document.body,
  );
}
