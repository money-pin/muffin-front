import { useEffect, useState } from "react";

import Button from "@/components/common/Button";
import TextField from "@/components/common/TextField";

interface EmailVerifyStepProps {
  initialSeconds: number; // 서버가 내려준 인증번호 만료 시간(초)
  onVerify: (code: string) => Promise<void>;
  onResend: () => Promise<number>; // 재전송 후 새 만료 시간(초) 반환
}

export default function EmailVerifyStep({
  initialSeconds,
  onVerify,
  onResend,
}: EmailVerifyStepProps) {
  const [code, setCode] = useState("");
  const [remaining, setRemaining] = useState(initialSeconds);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      setRemaining((r) => (r <= 0 ? 0 : r - 1));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const expired = remaining <= 0;
  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");

  const handleResend = async () => {
    setErrorMessage("");
    try {
      const seconds = await onResend();
      setRemaining(seconds);
      setCode("");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "재전송에 실패했어요.",
      );
    }
  };

  const handleComplete = async () => {
    if (isSubmitting) return;
    setErrorMessage("");
    setIsSubmitting(true);
    try {
      await onVerify(code);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "인증에 실패했어요.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const canComplete = code.length === 6 && !expired && !isSubmitting;

  return (
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
        <Button onClick={handleComplete} disabled={!canComplete}>
          완료
        </Button>
      </div>
    </div>
  );
}
