import Modal from "@/components/common/Modal";
import {
  INVESTMENT_QUIZ_PROMPT_COPY,
  type InvestmentQuizPromptVariant,
} from "@/pages/invest/trade/utils/investmentQuizPrompt";

interface InvestQuizPromptModalProps {
  variant: InvestmentQuizPromptVariant | null;
  onClose: () => void;
  onQuiz: () => void;
}

export default function InvestQuizPromptModal({
  variant,
  onClose,
  onQuiz,
}: InvestQuizPromptModalProps) {
  if (!variant) return null;
  const copy = INVESTMENT_QUIZ_PROMPT_COPY[variant];
  return (
    <Modal
      isOpen
      onClose={onClose}
      ariaLabel={copy.title}
      trapFocus
      className="max-h-[calc(100dvh-2rem-env(safe-area-inset-top)-env(safe-area-inset-bottom))] max-w-[332px] overflow-y-auto overscroll-contain rounded-2xl px-5 pt-6 pb-5"
      contentClassName="text-center"
    >
      <div
        onKeyDown={(event) => {
          // 공통 모달은 포커스 이동 시 스크롤을 막는다. 키보드로 이동한 버튼은
          // 큰 글자·작은 화면에서도 모달 내부에서 보이도록 맞춘다.
          if (
            event.key === "Tab" &&
            document.activeElement instanceof HTMLElement
          ) {
            document.activeElement.scrollIntoView({ block: "nearest" });
          }
          if (event.key === "Escape") {
            event.preventDefault();
            event.stopPropagation();
            onClose();
          }
        }}
        className="flex flex-col gap-6"
      >
        <div className="flex flex-col gap-2 break-keep">
          <h2 className="text-heading-20-bd text-neutral-900">{copy.title}</h2>
          <p className="text-body-16-md-tighter leading-[1.6] text-neutral-400">
            {copy.description}
          </p>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,7em),1fr))] gap-2">
          <button
            type="button"
            onClick={onClose}
            className="text-body-16-bd-tighter min-h-[50px] min-w-0 rounded-lg bg-neutral-50 px-3 py-3 leading-[1.6] [overflow-wrap:anywhere] break-keep text-neutral-400"
          >
            나중에 하기
          </button>
          <button
            type="button"
            onClick={onQuiz}
            className="text-body-16-bd-tighter bg-primary text-neutral-0 min-h-[50px] min-w-0 rounded-lg px-3 py-3 leading-[1.6] [overflow-wrap:anywhere] break-keep"
          >
            {copy.action}
          </button>
        </div>
      </div>
    </Modal>
  );
}
