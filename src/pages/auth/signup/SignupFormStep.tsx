import { useState } from "react";

import Button from "@/components/common/Button";
import TextField from "@/components/common/TextField";
import PrivacyPolicyModal from "@/pages/legal/PrivacyPolicyModal";
import chevronRightIcon from "@/assets/icon-24px/chevron-right.svg";

export interface SignupFormValues {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
  agreed: boolean;
}

interface SignupFormStepProps {
  values: SignupFormValues;
  onChange: (patch: Partial<SignupFormValues>) => void;
  onNext: () => void;
  submitting?: boolean;
  error?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// 영문·숫자 포함 8~16자
const PASSWORD_RE = /^(?=.*[A-Za-z])(?=.*\d).{8,16}$/;
const PASSWORD_GUIDE = "영문, 숫자를 포함한 8~16 조합으로 입력해주세요.";

export default function SignupFormStep({
  values,
  onChange,
  onNext,
  submitting = false,
  error,
}: SignupFormStepProps) {
  const { name, email, password, passwordConfirm, agreed } = values;
  const [privacyOpen, setPrivacyOpen] = useState(false);

  const emailError =
    email !== "" && !EMAIL_RE.test(email)
      ? "이메일 형식이 올바르지 않습니다."
      : undefined;

  const passwordValid = PASSWORD_RE.test(password);
  const passwordError =
    password !== "" && !passwordValid ? PASSWORD_GUIDE : undefined;
  const passwordSuccess = passwordValid
    ? "사용 가능한 비밀번호입니다."
    : undefined;

  const confirmMatch = passwordConfirm !== "" && passwordConfirm === password;
  const confirmError =
    passwordConfirm !== "" && passwordConfirm !== password
      ? "비밀번호가 일치하지 않습니다."
      : undefined;
  const confirmSuccess = confirmMatch ? "비밀번호가 일치합니다." : undefined;

  const canNext =
    name.trim() !== "" &&
    EMAIL_RE.test(email) &&
    passwordValid &&
    confirmMatch &&
    agreed;

  return (
    <div className="flex flex-1 flex-col px-5 pt-4 pb-8">
      <div className="flex flex-col gap-6">
        <TextField
          label="이름"
          required
          placeholder="홍길동"
          value={name}
          onChange={(v) => onChange({ name: v })}
        />
        <TextField
          label="이메일"
          type="email"
          required
          placeholder="example@email.com"
          error={emailError}
          value={email}
          onChange={(v) => onChange({ email: v })}
        />
        <TextField
          label="비밀번호"
          type="password"
          required
          placeholder="8자 이상 입력해주세요."
          hint={PASSWORD_GUIDE}
          error={passwordError}
          success={passwordSuccess}
          value={password}
          onChange={(v) => onChange({ password: v })}
        />
        <TextField
          label="비밀번호 재입력"
          type="password"
          required
          placeholder="다시 한번 입력해주세요."
          error={confirmError}
          success={confirmSuccess}
          value={passwordConfirm}
          onChange={(v) => onChange({ passwordConfirm: v })}
        />
      </div>

      <div className="mt-auto flex flex-col gap-5 pt-8">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onChange({ agreed: !agreed })}
            className="flex min-w-0 flex-1 items-center gap-2 text-left"
          >
            <span
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-[4px] border transition-colors ${
                agreed
                  ? "border-primary bg-primary"
                  : "border-neutral-100 bg-white"
              }`}
            >
              {agreed && (
                <svg width="14" height="14" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M2.5 6.5 5 9l4.5-5.5"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </span>
            <span className="text-body-14-md-tighter min-w-0 flex-1 text-neutral-700">
              개인정보처리방침 동의 <span className="text-primary">(필수)</span>
            </span>
          </button>
          <button
            type="button"
            onClick={() => setPrivacyOpen(true)}
            aria-label="개인정보처리방침 보기"
            className="flex size-11 shrink-0 items-center justify-center"
          >
            <img
              src={chevronRightIcon}
              alt=""
              aria-hidden="true"
              className="h-5 w-5"
              draggable={false}
            />
          </button>
        </div>

        {error && (
          <p className="text-body-14-md-tighter text-positive text-center">
            {error}
          </p>
        )}

        <Button onClick={onNext} disabled={!canNext || submitting}>
          다음
        </Button>
      </div>

      <PrivacyPolicyModal
        isOpen={privacyOpen}
        onClose={() => setPrivacyOpen(false)}
      />
    </div>
  );
}
