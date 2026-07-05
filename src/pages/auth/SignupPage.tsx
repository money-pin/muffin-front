import { useState } from "react";
import { useNavigate } from "react-router-dom";

import chevronLeftIcon from "@/assets/icon-28px/chevron-left.svg";
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

function SignupPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<"form" | "verify">("form");
  const [form, setForm] = useState<SignupFormValues>(INITIAL_FORM);

  const updateForm = (patch: Partial<SignupFormValues>) =>
    setForm((prev) => ({ ...prev, ...patch }));

  const handleFormNext = () => {
    // TODO: 중복 이메일 확인 + 인증번호 발송 API
    setStep("verify");
  };

  const handleComplete = () => {
    // TODO: 인증번호 검증 + 계정 생성 API
    navigate("/onboarding");
  };

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
        <h1 className="pointer-events-none absolute left-1/2 -translate-x-1/2 text-heading-18-bd text-neutral-900">
          가입하기
        </h1>
      </header>

      {step === "form" ? (
        <SignupFormStep
          values={form}
          onChange={updateForm}
          onNext={handleFormNext}
        />
      ) : (
        <EmailVerifyStep onComplete={handleComplete} />
      )}
    </div>
  );
}

export default SignupPage;
