import { useState } from "react";

import Button from "@/components/common/Button";
import closeIcon from "@/assets/icon-24px/close.svg";
import closeButtonIcon from "@/assets/icon-24px/close-button.svg";
import { NICKNAME_MAX_LENGTH, TAKEN_NICKNAMES } from "@/pages/my/myData";

interface NicknameModalProps {
  isOpen: boolean;
  currentNickname: string;
  onClose: () => void;
  onChange: (nickname: string) => void;
}

type NicknameStatus = "idle" | "taken" | "available";

// Figma 닉네임 변경 모달: 입력 + 중복/사용 가능 헬퍼 텍스트 + 변경 버튼
// 중복 검사는 API 연동 전 목데이터(TAKEN_NICKNAMES) 기준
export default function NicknameModal({
  isOpen,
  currentNickname,
  onClose,
  onChange,
}: NicknameModalProps) {
  const [value, setValue] = useState(currentNickname);

  if (!isOpen) return null;

  const trimmed = value.trim();
  const getStatus = (): NicknameStatus => {
    if (trimmed === "" || trimmed === currentNickname) return "idle";
    if (TAKEN_NICKNAMES.includes(trimmed)) return "taken";
    return "available";
  };
  const status = getStatus();

  const helperByStatus: Record<
    NicknameStatus,
    { text: string; className: string }
  > = {
    idle: {
      text: `최대 ${NICKNAME_MAX_LENGTH}자 설정 가능`,
      className: "text-neutral-400",
    },
    taken: { text: "이미 사용 중인 닉네임이에요!", className: "text-positive" },
    available: {
      text: "사용 가능한 닉네임이에요.",
      className: "text-primary",
    },
  };
  const helper = helperByStatus[status];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        aria-hidden="true"
        className="bg-neutral-1000/45 absolute inset-0"
        onClick={onClose}
      />

      <div className="relative z-10 w-[calc(100%-40px)] max-w-[326px] rounded-[16px] bg-white px-4 pt-6 pb-5">
        <div className="relative flex items-center justify-center">
          <p className="text-heading-18-bd text-neutral-900">닉네임 변경</p>
          <button
            type="button"
            onClick={onClose}
            className="absolute right-0"
            aria-label="닫기"
          >
            <img
              src={closeIcon}
              alt=""
              aria-hidden="true"
              className="h-6 w-6"
            />
          </button>
        </div>

        <div
          className={`mt-5 flex h-[52px] items-center gap-2 rounded-[12px] border px-4 ${
            status === "taken" ? "border-positive" : "border-neutral-100"
          }`}
        >
          <input
            value={value}
            maxLength={NICKNAME_MAX_LENGTH}
            onChange={(event) => setValue(event.target.value)}
            className="text-body-16-md-tighter w-full text-neutral-900 outline-none placeholder:text-neutral-400"
            placeholder="닉네임 입력"
          />
          {value !== "" && (
            <button
              type="button"
              onClick={() => setValue("")}
              aria-label="입력 지우기"
            >
              <img
                src={closeButtonIcon}
                alt=""
                aria-hidden="true"
                className="h-5 w-5"
              />
            </button>
          )}
        </div>
        <p className={`text-caption-12-md mt-2 ${helper.className}`}>
          {helper.text}
        </p>

        <Button
          onClick={() => onChange(trimmed)}
          disabled={status !== "available"}
          className="mt-5"
        >
          변경
        </Button>
      </div>
    </div>
  );
}
