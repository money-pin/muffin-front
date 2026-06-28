import { useState } from "react";

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
  const inputType = type === "password" ? (showPassword ? "text" : "password") : type;

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-bold text-[#1B1B1B]">
        {label}
        {required && <span className="text-[#FF3045] ml-0.5">*</span>}
      </label>
      <div className={`flex items-center h-[50px] rounded-[8px] border px-4 gap-2.5 transition-all bg-white
        ${error ? "border-[#FF3045]" : "border-[#E2E2E2] focus-within:border-[#F46C0E]"}`}>
        <input
          type={inputType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 text-sm outline-none bg-transparent text-[#1B1B1B] placeholder:text-[#E2E2E2]"
        />
        <div className="flex items-center gap-2">
          {type === "password" && (
            <button type="button" onClick={() => setShowPassword((v) => !v)} className="text-[#E2E2E2]">
              {showPassword ? (
                <svg width="22" height="15" viewBox="0 0 22 15" fill="none">
                  <path d="M11 0C6 0 1.73 3.11 0 7.5 1.73 11.89 6 15 11 15s9.27-3.11 11-7.5C20.27 3.11 16 0 11 0zm0 12.5c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" fill="currentColor"/>
                </svg>
              ) : (
                <svg width="22" height="19" viewBox="0 0 22 19" fill="none">
                  <path d="M11 4c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92C20.07 12.45 21.27 10.6 22 8.5 20.27 3.61 16 0 11 0 9.73 0 8.54.25 7.44.68l2.16 2.16C10.24 4.13 10.61 4 11 4zM1 1.27L3.28 3.55l.46.46C1.86 5.4.72 7.31 0 8.5c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L18.73 19 20 17.73 2.27 0 1 1.27zM6.53 6.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z" fill="currentColor"/>
                </svg>
              )}
            </button>
          )}
          {value && (
            <button type="button" onClick={() => onChange("")} className="text-[#E2E2E2]">
              <svg width="6" height="6" viewBox="0 0 6 6" fill="none">
                <path d="M5.5 0.5L0.5 5.5M0.5 0.5L5.5 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          )}
        </div>
      </div>
      {error && <p className="text-xs text-[#FF3045]">{error}</p>}
    </div>
  );
}
