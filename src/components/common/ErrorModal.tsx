import Modal from "@/components/common/Modal";
import errorAlertIcon from "@/assets/icon-40px/error-alert.svg";
import type { ErrorMessageInfo } from "@/lib/errorMessages";

interface ErrorModalProps {
  isOpen: boolean;
  info: ErrorMessageInfo;
  onPrimaryAction: () => void;
  onSecondaryAction?: () => void;
  onClose: () => void;
  isLoading?: boolean;
}

export default function ErrorModal({
  isOpen,
  info,
  onPrimaryAction,
  onSecondaryAction,
  onClose,
  isLoading = false,
}: ErrorModalProps) {
  const shouldShowIcon = info.showIcon ?? info.variant === "error";
  const iconBgClass =
    info.variant === "info" ? "bg-secondary-100" : "bg-neutral-50";
  const primaryClass =
    info.variant === "info"
      ? "bg-primary text-neutral-0"
      : "bg-positive text-neutral-0";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="rounded-2xl px-5 pt-6 pb-5"
      contentClassName="flex flex-col items-center gap-6 text-center"
    >
      <div className="flex flex-col items-center gap-5">
        {shouldShowIcon && (
          <div
            className={`flex size-14 items-center justify-center rounded-full ${iconBgClass}`}
          >
            {/* TODO: info variant 전용 아이콘 에셋 확인 필요 */}
            <img
              src={errorAlertIcon}
              alt=""
              aria-hidden="true"
              className="size-10"
              draggable={false}
            />
          </div>
        )}

        <div className="flex w-full flex-col items-center gap-2">
          <h2 className="text-heading-20-bd leading-[1.5] text-neutral-900">
            {info.title}
          </h2>
          <p className="text-body-16-md-tighter whitespace-pre-line text-neutral-400">
            {info.description}
          </p>
        </div>
      </div>

      <div className="flex w-full gap-2">
        {info.secondaryLabel && (
          <button
            type="button"
            onClick={onSecondaryAction ?? onClose}
            disabled={isLoading}
            className="text-body-16-bd-tighter flex h-[50px] flex-1 items-center justify-center rounded-lg bg-neutral-50 px-5 text-neutral-500 transition-opacity disabled:opacity-60"
          >
            {info.secondaryLabel}
          </button>
        )}
        <button
          type="button"
          onClick={onPrimaryAction}
          disabled={isLoading}
          className={`text-body-16-bd-tighter flex h-[50px] flex-1 items-center justify-center rounded-lg px-5 transition-opacity disabled:opacity-60 ${primaryClass}`}
        >
          {isLoading ? "처리 중..." : info.primaryLabel}
        </button>
      </div>
    </Modal>
  );
}
