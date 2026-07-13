//구매 확정 안내 모달
import Modal from "@/components/common/Modal2";

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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="w-[350px] rounded-[20px] px-[29px] py-6"
      contentClassName="flex flex-col items-center text-center"
    >
      <img src={checkConfirmIcon} alt="" />

      <h2 className="mt-5 text-[length:var(--text-heading-20-bd)] leading-[var(--text-heading-20-bd--line-height)] font-[var(--text-heading-20-bd--font-weight)] text-[var(--color-neutral-900)]">
        구매가 완료되었어요!
      </h2>

      <p className="mt-2 text-[length:var(--text-body-16-md-tighter)] leading-[var(--text-body-16-md-tighter--line-height)] font-[var(--text-body-16-md-tighter--font-weight)] tracking-[var(--text-body-16-md-tighter--letter-spacing)] text-[var(--color-neutral-400)]">
        <span className="text-center text-[length:var(--16,16px)] font-bold leading-[1.6] tracking-[var(--font-letterSpacing-tight,0)] text-[var(--Prymary-500---pr,#F46C0E)]">
          {" "}
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
    </Modal>
  );
}

export default InvestCompleteModal;
