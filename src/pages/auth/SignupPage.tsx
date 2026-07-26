import { useState } from "react";
import { useNavigate } from "react-router-dom";

import chevronLeftIcon from "@/assets/icon-28px/chevron-left.svg";
import {
  signup,
  sendEmailVerification,
  confirmEmailVerification,
} from "@/lib/authApi";
import SignupFormStep from "./signup/SignupFormStep";
import type { SignupFormValues } from "./signup/SignupFormStep";
import EmailVerifyStep from "./signup/EmailVerifyStep";

const INITIAL_FORM: SignupFormValues = {
  name: "",
  email: "",
  password: "",
  passwordConfirm: "",
  agreed: false,
};

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

function SignupPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<"form" | "verify">("form");
  const [form, setForm] = useState<SignupFormValues>(INITIAL_FORM);
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [codeSeconds, setCodeSeconds] = useState(0);

  const updateForm = (patch: Partial<SignupFormValues>) =>
    setForm((prev) => ({ ...prev, ...patch }));

  // 폼 제출: 계정 생성(1단계) → 인증번호 발송(2단계) → 인증 화면으로
  const handleFormNext = async () => {
    if (isSubmitting) return;
    setFormError("");
    setIsSubmitting(true);

    try {
      await signup({
        name: form.name,
        email: form.email,
        password: form.password,
        termsAgreed: form.agreed,
      });
      const expiresIn = await sendEmailVerification();
      setCodeSeconds(expiresIn);
      setStep("verify");
    } catch (error) {
      setFormError(getErrorMessage(error, "회원가입에 실패했어요."));
    } finally {
      setIsSubmitting(false);
    }
  };

  // 인증번호 확인(3단계) → 온보딩. 실패 시 EmailVerifyStep이 메시지 표시
  const handleVerify = async (code: string) => {
    await confirmEmailVerification(code);
    navigate("/onboarding");
  };

  const handleResend = () => sendEmailVerification();

  const goBack = () => {
    if (step === "verify") {
      setStep("form");
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <header className="relative flex h-14 shrink-0 items-center px-5">
        <button
          type="button"
          onClick={goBack}
          aria-label="뒤로가기"
          className="flex h-7 w-7 items-center justify-center"
        >
          <img
            src={chevronLeftIcon}
            alt=""
            aria-hidden="true"
            className="h-7 w-7"
            draggable={false}
          />
        </button>
        <h1 className="text-heading-18-bd pointer-events-none absolute left-1/2 -translate-x-1/2 text-neutral-900">
          가입하기
        </h1>
      </header>

      {step === "form" ? (
        <SignupFormStep
          values={form}
          onChange={updateForm}
          onNext={handleFormNext}
          submitting={isSubmitting}
          error={formError}
        />
      ) : (
        <EmailVerifyStep
          initialSeconds={codeSeconds}
          onVerify={handleVerify}
          onResend={handleResend}
        />
      )}
    </div>
  );
}

export default SignupPage;
