import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import chevronLeftIcon from "@/assets/icon-28px/chevron-left.svg";
import Button from "@/components/common/Button";
import TextField from "@/components/common/TextField";
import {
  requestPasswordResetCode,
  confirmPasswordResetCode,
  resetPassword,
} from "@/lib/authApi";

// 비밀번호 찾기(재설정) 화면 (이슈 #265)
// ⚠️ 백엔드 스펙 확정 전 스캐폴딩. 회원가입 이메일 인증과 동일 패턴을 전제로 잡아둠.
//    엔드포인트/필드는 authApi.ts의 TODO를 따라 확정 후 맞추면 된다.
// 플로우: 이메일 입력 → 인증번호 확인 → 새 비밀번호 설정 → 완료

type Step = "email" | "verify" | "reset";

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

function FindPasswordPage() {
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const [remaining, setRemaining] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (step !== "verify") return;

    const id = setInterval(() => {
      setRemaining((r) => (r <= 0 ? 0 : r - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [step]);

  const expired = remaining <= 0;
  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");

  // 1단계: 인증번호 발송
  const handleSendCode = async () => {
    if (isSubmitting || email.trim() === "") return;
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const expiresIn = await requestPasswordResetCode(email.trim());
      setRemaining(expiresIn);
      setStep("verify");
    } catch (error) {
      setErrorMessage(getErrorMessage(error, "인증번호 발송에 실패했어요."));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    setErrorMessage("");
    try {
      const expiresIn = await requestPasswordResetCode(email.trim());
      setRemaining(expiresIn);
      setCode("");
    } catch (error) {
      setErrorMessage(getErrorMessage(error, "재전송에 실패했어요."));
    }
  };

  // 2단계: 인증번호 확인
  const handleVerify = async () => {
    if (isSubmitting || code.length !== 6 || expired) return;
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const { resetToken: token } = await confirmPasswordResetCode({
        email: email.trim(),
        code,
      });
      setResetToken(token);
      setStep("reset");
    } catch (error) {
      setErrorMessage(getErrorMessage(error, "인증에 실패했어요."));
    } finally {
      setIsSubmitting(false);
    }
  };

  // 3단계: 새 비밀번호 저장
  const handleReset = async () => {
    if (isSubmitting || !canReset) return;
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      await resetPassword({ resetToken, newPassword: password });
      navigate("/login", { replace: true });
    } catch (error) {
      setErrorMessage(getErrorMessage(error, "비밀번호 변경에 실패했어요."));
    } finally {
      setIsSubmitting(false);
    }
  };

  const passwordMismatch =
    passwordConfirm !== "" && password !== passwordConfirm;
  const canReset =
    password !== "" && password === passwordConfirm && !isSubmitting;

  const goBack = () => {
    if (step === "verify") {
      setStep("email");
    } else if (step === "reset") {
      setStep("verify");
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
          비밀번호 찾기
        </h1>
      </header>

      {step === "email" && (
        <div className="flex flex-1 flex-col px-5 pt-5 pb-8">
          <h2 className="text-heading-20-bd text-neutral-1000 leading-[1.5]">
            가입한 이메일로
            <br />
            인증번호를 보내드릴게요.
          </h2>

          <div className="mt-9">
            <TextField
              label="이메일"
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={setEmail}
              error={errorMessage || undefined}
            />
          </div>

          <div className="mt-auto">
            <Button
              onClick={handleSendCode}
              disabled={email.trim() === "" || isSubmitting}
            >
              인증번호 받기
            </Button>
          </div>
        </div>
      )}

      {step === "verify" && (
        <div className="flex flex-1 flex-col px-5 pt-5 pb-8">
          <h2 className="text-heading-20-bd text-neutral-1000 leading-[1.5]">
            이메일로 전송된
            <br />
            인증번호를 입력해주세요.
          </h2>

          <div className="mt-9">
            <TextField
              label="인증번호"
              type="tel"
              placeholder="인증번호 6자리"
              value={code}
              onChange={(v) => setCode(v.replace(/\D/g, "").slice(0, 6))}
              error={
                errorMessage ||
                (expired
                  ? "인증번호가 만료되었습니다. 재전송해 주세요."
                  : undefined)
              }
              rightSlot={
                <span
                  className={`text-body-14-md-tighter ${
                    expired ? "text-neutral-400" : "text-primary"
                  }`}
                >
                  {mm}:{ss}
                </span>
              }
            />

            <p className="text-body-14-md-tighter mt-5 text-neutral-400">
              인증 문자를 받지 못하셨나요?&nbsp;{" "}
              <button
                type="button"
                onClick={handleResend}
                className="text-body-14-md-tighter text-primary underline"
              >
                다시 보내기
              </button>
            </p>
          </div>

          <div className="mt-auto">
            <Button
              onClick={handleVerify}
              disabled={code.length !== 6 || expired || isSubmitting}
            >
              다음
            </Button>
          </div>
        </div>
      )}

      {step === "reset" && (
        <div className="flex flex-1 flex-col px-5 pt-5 pb-8">
          <h2 className="text-heading-20-bd text-neutral-1000 leading-[1.5]">
            새 비밀번호를
            <br />
            입력해주세요.
          </h2>

          <div className="mt-9 flex flex-col gap-4">
            <TextField
              label="새 비밀번호"
              type="password"
              placeholder="새 비밀번호를 입력해주세요."
              value={password}
              onChange={setPassword}
            />
            <TextField
              label="새 비밀번호 확인"
              type="password"
              placeholder="비밀번호를 다시 입력해주세요."
              value={passwordConfirm}
              onChange={setPasswordConfirm}
              error={
                passwordMismatch
                  ? "비밀번호가 일치하지 않습니다."
                  : errorMessage || undefined
              }
            />
          </div>

          <div className="mt-auto">
            <Button onClick={handleReset} disabled={!canReset}>
              비밀번호 변경
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default FindPasswordPage;
