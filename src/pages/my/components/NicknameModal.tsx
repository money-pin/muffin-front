import { useEffect, useState } from "react";

import Button from "@/components/common/Button";
import { checkNickname } from "@/lib/mypageApi";
import {
  getNicknameFormatStatus,
  NICKNAME_GUIDE_TEXT,
  NICKNAME_INVALID_TEXT,
  NICKNAME_MAX_LENGTH,
} from "@/lib/nickname";
import closeIcon from "@/assets/icon-24px/close.svg";
import closeButtonIcon from "@/assets/icon-24px/close-button.svg";
import messageSuccessIcon from "@/assets/icon-16px/message-success.svg";
import messageErrorIcon from "@/assets/icon-16px/message-error.svg";

interface NicknameModalProps {
  isOpen: boolean;
  currentNickname: string;
  onClose: () => void;
  onChange: (nickname: string) => void;
}

type NicknameStatus =
  "idle" | "invalid" | "checking" | "taken" | "available" | "error";

// Figma 닉네임 변경 모달: 입력 + 중복/사용 가능 헬퍼 텍스트 + 변경 버튼
// 중복 검사는 GET /api/mypage/nicknames/availability (입력 디바운스 후 조회)
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
  // 중복 확인 요청이 실패한 닉네임. 이 값이 현재 입력과 같으면 "확인 실패" 안내를 띄운다.
  const [checkFailedNickname, setCheckFailedNickname] = useState<string | null>(
    null,
  );
  const trimmed = value.trim();
  const formatStatus = getNicknameFormatStatus(value);
  // 형식(최대 6자·특수문자 제외)이 유효하고, 현재 닉네임과 다를 때만 중복 조회한다.
  const isCheckable = formatStatus === "valid" && trimmed !== currentNickname;

  // 입력이 멈추면(400ms) 중복 조회. 결과는 checked에 저장(비동기 콜백에서만 setState).
  useEffect(() => {
    if (!isCheckable) return;
    let active = true;
    const timer = window.setTimeout(() => {
      checkNickname(trimmed)
        .then((res) => {
          if (!active) return;
          setChecked({ nickname: trimmed, available: res.available });
          setCheckFailedNickname((prev) => (prev === trimmed ? null : prev));
        })
        .catch(() => {
          // 요청 실패는 "확인 중"에 머무르지 않도록 별도 상태로 표시한다.
          if (active) setCheckFailedNickname(trimmed);
        });
    }, 400);
    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [trimmed, isCheckable]);

  if (!isOpen) return null;

  const status: NicknameStatus =
    formatStatus === "invalid"
      ? "invalid"
      : !isCheckable
        ? "idle"
        : checkFailedNickname === trimmed
          ? "error"
          : checked?.nickname === trimmed
            ? checked.available
              ? "available"
              : "taken"
            : "checking";

  const helperByStatus: Record<
    NicknameStatus,
    { text: string; className: string; icon?: "success" | "error" }
  > = {
    idle: {
      text: NICKNAME_GUIDE_TEXT,
      className: "text-neutral-400",
    },
    invalid: {
      text: NICKNAME_INVALID_TEXT,
      className: "text-positive",
      icon: "error",
    },
    checking: {
      text: "닉네임 확인 중이에요...",
      className: "text-neutral-400",
    },
    taken: {
      text: "이미 사용 중인 닉네임이에요!",
      className: "text-positive",
      icon: "error",
    },
    available: {
      text: "사용 가능한 닉네임이에요.",
      className: "text-green",
      icon: "success",
    },
    error: {
      text: "닉네임 확인에 실패했어요. 다시 입력해주세요.",
      className: "text-positive",
      icon: "error",
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
            status === "taken" || status === "invalid" || status === "error"
              ? "border-positive"
              : "border-neutral-100"
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
        <p
          className={`text-caption-12-md mt-2 flex items-center gap-1 ${helper.className}`}
        >
          {helper.icon && (
            <img
              src={
                helper.icon === "success"
                  ? messageSuccessIcon
                  : messageErrorIcon
              }
              alt=""
              aria-hidden="true"
              className="size-3.5 shrink-0"
              draggable={false}
            />
          )}
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
