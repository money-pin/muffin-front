import Modal from "@/components/common/Modal";
import { useEffect, useRef } from "react";

interface InvestSectorGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onView: () => void;
}

export default function InvestSectorGuideModal({
  isOpen,
  onClose,
  onView,
}: InvestSectorGuideModalProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!isOpen) return;
    const previousFocus = document.activeElement;
    contentRef.current?.querySelector<HTMLButtonElement>("button")?.focus();
    return () => {
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) {
        previousFocus.focus({ preventScroll: true });
      }
    };
  }, [isOpen]);
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      ariaLabel="어떤 종목에 투자하고 있을까요?"
      sideOffsetClassName="px-[29px]"
      className="rounded-2xl px-5 pt-6 pb-5"
      contentClassName="flex flex-col gap-6 text-center"
    >
      <div
        ref={contentRef}
        className="flex flex-col gap-6"
        onKeyDown={(event) => {
          if (event.key === "Escape") onClose();
          if (event.key !== "Tab") return;
          const buttons = contentRef.current?.querySelectorAll("button");
          if (!buttons?.length) return;
          const first = buttons[0];
          const last = buttons[buttons.length - 1];
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
          }
        }}
      >
        <div className="flex flex-col gap-2">
          <h2 className="text-heading-20-bd break-keep text-neutral-900">
            어떤 종목에 투자하고 있을까요?
          </h2>
          <p className="text-body-16-md-tighter leading-[1.6] break-keep text-neutral-400">
            모의투자에서 선택한 섹터가 실제로 어떤 ETF와 연결되는지 쉽게
            알려드릴게요.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onClose}
            className="text-body-16-bd-tighter min-h-[50px] rounded-lg bg-neutral-50 px-3 text-neutral-400"
          >
            닫기
          </button>
          <button
            type="button"
            onClick={onView}
            className="text-body-16-bd-tighter bg-primary min-h-[50px] rounded-lg px-3 text-white"
          >
            보러가기
          </button>
        </div>
      </div>
    </Modal>
  );
}
