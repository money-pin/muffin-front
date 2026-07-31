import {
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { RemoveScroll } from "react-remove-scroll";

const ANIMATION_DURATION_MS = 300;
const HALF_SNAP_RATIO = 0.46;
const EXPANDED_SNAP_RATIO = 0.08;
const CLOSE_DRAG_THRESHOLD = 80;
const EXPAND_DRAG_THRESHOLD = 80;

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  ariaLabel: string;
  children: ReactNode;
  snapMode?: "content" | "half-full";
}

export default function BottomSheet({
  isOpen,
  onClose,
  ariaLabel,
  children,
  snapMode = "content",
}: BottomSheetProps) {
  const [isMounted, setIsMounted] = useState(isOpen);
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);

  const sheetRef = useRef<HTMLElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const dragStartYRef = useRef(0);
  const dragStartExpandedRef = useRef(false);

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
        setIsExpanded(false);
        setDragOffset(0);

        // transitionend가 발생하지 않는 경우를 대비한 fallback
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
      setIsExpanded(snapMode === "content");
    });

    return () => window.cancelAnimationFrame(frame);
  }, [isOpen, isMounted, snapMode]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
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

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [isOpen, isMounted]);

  useEffect(() => {
    if (isMounted) return;

    previousFocusRef.current?.focus();
    previousFocusRef.current = null;
  }, [isMounted]);

  useEffect(() => {
    return () => {
      previousFocusRef.current?.focus();
    };
  }, []);

  const startSheetDrag = (
    event: ReactPointerEvent<HTMLDivElement>,
    startY = event.clientY,
  ) => {
    if (snapMode !== "half-full") return;

    dragStartYRef.current = startY;
    dragStartExpandedRef.current = isExpanded;

    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const moveSheetDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (snapMode !== "half-full" || !isDragging) return;

    const deltaY = event.clientY - dragStartYRef.current;

    setDragOffset(Math.max(0, deltaY));
  };

  const endSheetDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (snapMode !== "half-full" || !isDragging) return;

    const deltaY = event.clientY - dragStartYRef.current;

    setIsDragging(false);
    setDragOffset(0);

    event.currentTarget.releasePointerCapture(event.pointerId);

    if (dragStartExpandedRef.current) {
      if (deltaY > CLOSE_DRAG_THRESHOLD) {
        onClose();
      }

      return;
    }

    if (deltaY < -EXPAND_DRAG_THRESHOLD) {
      setIsExpanded(true);
      return;
    }

    if (deltaY > CLOSE_DRAG_THRESHOLD) {
      onClose();
    }
  };

  const handleHandlePointerDown = (
    event: ReactPointerEvent<HTMLDivElement>,
  ) => {
    startSheetDrag(event);
  };

  if (!isMounted || typeof document === "undefined") return null;

  const snapHeight = isExpanded
    ? `calc(${(1 - EXPANDED_SNAP_RATIO) * 100}dvh)`
    : `calc(${(1 - HALF_SNAP_RATIO) * 100}dvh)`;

  const snapTranslate = !isVisible ? "100%" : `${dragOffset}px`;

  return createPortal(
    <RemoveScroll>
      <div className="fixed inset-0 z-50 flex items-end justify-center">
        <div
          aria-hidden="true"
          className={`bg-neutral-1000/50 absolute inset-0 transition-opacity duration-300 ${
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
          style={
            snapMode === "half-full"
              ? {
                  height: snapHeight,
                  transform: `translateY(${snapTranslate})`,
                }
              : undefined
          }
          className={`bg-neutral-0 relative z-10 flex max-h-[100dvh] w-full max-w-[var(--max-width-app)] flex-col overflow-hidden rounded-t-[20px] outline-none ${
            isDragging
              ? ""
              : "transition-[height,transform] duration-300 ease-out"
          } ${
            snapMode === "half-full"
              ? ""
              : isVisible
                ? "translate-y-0"
                : "translate-y-full"
          }`}
        >
          <div
            aria-hidden="true"
            className={`flex shrink-0 touch-none justify-center pt-4 ${
              snapMode === "half-full"
                ? "from-neutral-0 to-neutral-0/0 bg-gradient-to-b from-[39%] to-[85%] pb-8"
                : ""
            }`}
            onPointerDown={handleHandlePointerDown}
            onPointerMove={moveSheetDrag}
            onPointerUp={endSheetDrag}
            onPointerCancel={endSheetDrag}
          >
            <div className="h-1 w-12 rounded-full bg-neutral-100" />
          </div>

          {snapMode === "half-full" ? (
            <div className="min-h-0 flex-1 touch-pan-y overflow-y-scroll overscroll-contain [-webkit-overflow-scrolling:touch]">
              {children}
            </div>
          ) : (
            children
          )}
        </section>
      </div>
    </RemoveScroll>,
    document.body,
  );
}