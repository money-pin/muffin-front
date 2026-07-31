import { useEffect, useState } from "react";

import Button from "@/components/common/Button";
import { checkNickname } from "@/lib/mypageApi";
import closeIcon from "@/assets/icon-24px/close.svg";
import closeButtonIcon from "@/assets/icon-24px/close-button.svg";
import { NICKNAME_MAX_LENGTH } from "@/pages/my/myData";

interface NicknameModalProps {
  isOpen: boolean;
  currentNickname: string;
  onClose: () => void;
  onChange: (nickname: string) => void;
}

type NicknameStatus = "idle" | "checking" | "taken" | "available";

// Figma 닉네임 변경 모달: 입력 + 중복/사용 가능 헬퍼 텍스트 + 변경 버튼
// 중복 검사는 GET /api/mypage/nickname/check (입력 디바운스 후 조회)
export default function NicknameModal({
  isOpen,
  currentNickname,
  onClose,
  onChange,
}: NicknameModalProps) {
  const [value, setValue] = useState(currentNickname);
  // 조회 결과만 상태로 두고, 표시 status는 렌더에서 파생한다
  // (effect 내 동기 setState 금지 규칙 대응)
  const [checked, setChecked] = useState<{
    nickname: string;
    available: boolean;
  } | null>(null);
  const trimmed = value.trim();
  const isCheckable = trimmed !== "" && trimmed !== currentNickname;

  // 입력이 멈추면(400ms) 중복 조회. 결과는 checked에 저장(비동기 콜백에서만 setState).
  useEffect(() => {
    if (!isCheckable) return;
    let active = true;
    const timer = window.setTimeout(() => {
      checkNickname(trimmed)
        .then((res) => {
          if (active)
            setChecked({ nickname: trimmed, available: res.available });
        })
        .catch(() => {});
    }, 400);
    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [trimmed, isCheckable]);

  if (!isOpen) return null;

  const status: NicknameStatus = !isCheckable
    ? "idle"
    : checked?.nickname === trimmed
      ? checked.available
        ? "available"
        : "taken"
      : "checking";

  const helperByStatus: Record<
    NicknameStatus,
    { text: string; className: string }
  > = {
    idle: {
      text: `최대 ${NICKNAME_MAX_LENGTH}자 설정 가능`,
      className: "text-neutral-400",
    },
    checking: {
      text: "닉네임 확인 중이에요...",
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
