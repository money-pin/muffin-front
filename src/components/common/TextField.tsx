import { useState } from "react";

import eyeIcon from "@/assets/icon-24px/eye.svg";
import eyeOffIcon from "@/assets/icon-24px/eye-off.svg";
import closeButtonIcon from "@/assets/icon-24px/close-button.svg";

interface TextFieldProps {
  label?: string; // 없으면 라벨 미노출 (예: 온보딩 닉네임)
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  type?: "text" | "password" | "email" | "tel";
  error?: string;
  hint?: string; // 안내 문구(회색). error가 있으면 error가 우선 표시됨
  required?: boolean;
  maxLength?: number;
  rightSlot?: React.ReactNode; // 예: 인증번호 타이머("05:00") 등 커스텀 우측 요소
}

export default function TextField({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  error,
  hint,
  required = false,
  maxLength,
  rightSlot,
}: TextFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const inputType =
    type === "password" ? (showPassword ? "text" : "password") : type;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-body-14-md text-neutral-700">
          {label}
          {required && <span className="ml-0.5 text-primary">*</span>}
        </label>
      )}

      <div
        className={`flex h-[50px] items-center gap-2.5 rounded-[8px] border bg-white px-4 transition-all
        ${
          error
            ? "border-positive"
            : "border-neutral-100 focus-within:border-primary"
        }`}
      >
        <input
          type={inputType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
          className="flex-1 bg-transparent text-body-14-rg text-neutral-900 outline-none placeholder:text-neutral-400"
        />

        <div className="flex items-center gap-2">
          {rightSlot}

          {type === "password" && (
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="flex h-6 w-6 items-center justify-center"
              aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
            >
              <img
                src={showPassword ? eyeIcon : eyeOffIcon}
                alt=""
                aria-hidden="true"
                className="h-6 w-6 object-contain"
                draggable={false}
              />
            </button>
          )}

          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="flex h-6 w-6 items-center justify-center"
              aria-label="입력값 지우기"
            >
              <img
                src={closeButtonIcon}
                alt=""
                aria-hidden="true"
                className="h-[18px] w-[18px] object-contain"
                draggable={false}
              />
            </button>
          )}
        </div>
      </div>

      {error ? (
        <p className="text-caption-12-md text-positive">{error}</p>
      ) : (
        hint && <p className="text-caption-12-md text-neutral-400">{hint}</p>
      )}
    </div>
  );
}
