import { useState } from "react";

import eyeIcon from "@/assets/icon-24px/eye.svg";
import eyeOffIcon from "@/assets/icon-24px/eye-off.svg";
import closeButtonIcon from "@/assets/icon-24px/close-button.svg";

interface TextFieldProps {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  type?: "text" | "password" | "email" | "tel";
  error?: string;
  required?: boolean;
}

export default function TextField({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  error,
  required = false,
}: TextFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const inputType =
    type === "password" ? (showPassword ? "text" : "password") : type;

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-bold text-[#1B1B1B]">
        {label}
        {required && <span className="ml-0.5 text-[#FF3045]">*</span>}
      </label>

      <div
        className={`flex h-[50px] items-center gap-2.5 rounded-[8px] border bg-white px-4 transition-all
        ${
          error
            ? "border-[#FF3045]"
            : "border-[#E2E2E2] focus-within:border-[#F46C0E]"
        }`}
      >
        <input
          type={inputType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-sm text-[#1B1B1B] outline-none placeholder:text-[#E2E2E2]"
        />

        <div className="flex items-center gap-2">
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

      {error && <p className="text-xs text-[#FF3045]">{error}</p>}
    </div>
  );
}
