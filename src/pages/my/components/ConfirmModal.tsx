interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  description?: string;
  confirmLabel: string;
  danger?: boolean; // 회원 탈퇴 등 위험 동작 — 빨간(positive 토큰) 스타일
  onCancel: () => void;
  onConfirm: () => void;
}

// Figma 설정 확인 모달: 중앙 카드 + 취소/확인 2버튼 (로그아웃·회원 탈퇴)
export default function ConfirmModal({
  isOpen,
  title,
  description,
  confirmLabel,
  danger = false,
  onCancel,
  onConfirm,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 mx-auto max-w-[390px] bg-neutral-1000/45"
        onClick={onCancel}
      />

      <div className="relative z-10 w-[326px] rounded-[16px] bg-white px-4 pb-4 pt-7">
        <p className="text-center text-heading-18-bd text-neutral-900">
          {title}
        </p>
        {description && (
          <p className="mt-3 whitespace-pre-line text-center text-body-14-md text-neutral-600">
            {description}
          </p>
        )}

        <div className="mt-6 flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="h-[48px] flex-1 rounded-[12px] bg-neutral-50 text-body-16-bd-tighter text-neutral-400"
          >
            취소
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`h-[48px] flex-1 rounded-[12px] text-body-16-bd-tighter ${
              danger
                ? "border border-positive-100 bg-positive-50 text-positive"
                : "bg-primary text-white"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
