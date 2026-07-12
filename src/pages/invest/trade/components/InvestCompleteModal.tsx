import Modal from "@/components/common/Modal";

import checkConfirmIcon from "@/assets/check-confirm.svg";

interface InvestCompleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

function InvestCompleteModal({
  isOpen,
  onClose,
  onConfirm,
}: InvestCompleteModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col items-center pt-6">
        <img src={checkConfirmIcon} alt="" className="h-24 w-24" />

        <h2 className="mt-5 text-center text-[length:var(--text-heading-20-bd)] leading-[var(--text-heading-20-bd--line-height)] font-[var(--text-heading-20-bd--font-weight)] text-[var(--color-neutral-900)]">
          구매가 완료되었어요!
        </h2>

        <p className="mt-2 text-center text-[length:var(--text-body-16-md-tighter)] leading-[var(--text-body-16-md-tighter--line-height)] font-[var(--text-body-16-md-tighter--font-weight)] tracking-[var(--text-body-16-md-tighter--letter-spacing)] text-[var(--color-neutral-400)]">
          <span className="text-[length:var(--text-body-14-bd)] leading-[var(--text-body-14-bd--line-height)] font-[var(--text-body-14-bd--font-weight)] text-[var(--color-primary)]">
            내일 오전 10시
          </span>
          에 오늘의 투자 성과를
          <br />
          알려드릴게요.
        </p>

        <button
          type="button"
          onClick={onConfirm}
          className="mt-6 h-[52px] w-[292px] rounded-[12px] bg-[var(--color-primary)] text-[length:var(--text-body-16-bd-tighter)] leading-[var(--text-body-16-bd-tighter--line-height)] font-[var(--text-body-16-bd-tighter--font-weight)] tracking-[var(--text-body-16-bd-tighter--letter-spacing)] text-[var(--color-neutral-0)]"
        >
          확인
        </button>
      </div>
    </Modal>
  );
}

export default InvestCompleteModal;
