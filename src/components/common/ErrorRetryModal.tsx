import Modal from "@/components/common/Modal";
import errorAlertIcon from "@/assets/icon-40px/error-alert.svg";

interface ErrorRetryModalProps {
  isOpen: boolean;
  onRetry: () => void;
  title?: string;
  description?: string;
  retryLabel?: string;
  isRetrying?: boolean;
}

export default function ErrorRetryModal({
  isOpen,
  onRetry,
  title = "일시적인 오류가 발생했어요.",
  description = "네트워크 상태를 확인한 후\n다시 시도해주세요.",
  retryLabel = "다시 시도",
  isRetrying = false,
}: ErrorRetryModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={() => undefined}
      className="rounded-2xl px-5 pt-6 pb-5"
      contentClassName="flex flex-col items-center gap-6 text-center"
    >
      <div className="flex flex-col items-center gap-5">
        <div className="flex size-14 items-center justify-center rounded-full bg-neutral-50">
          <img
            src={errorAlertIcon}
            alt=""
            aria-hidden="true"
            className="size-10"
            draggable={false}
          />
        </div>

        <div className="flex w-full flex-col items-center gap-2">
          <h2 className="text-heading-20-bd leading-[1.5] text-neutral-900">
            {title}
          </h2>
          <p className="text-body-16-md-tighter whitespace-pre-line text-neutral-400">
            {description}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onRetry}
        disabled={isRetrying}
        className="bg-positive text-body-16-bd-tighter text-neutral-0 flex h-[50px] w-full items-center justify-center rounded-lg px-5 transition-opacity disabled:opacity-60"
      >
        {isRetrying ? "다시 시도 중..." : retryLabel}
      </button>
    </Modal>
  );
}
