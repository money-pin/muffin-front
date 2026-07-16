import { useEffect, useState } from "react";

import Button from "@/components/common/Button";
import TextField from "@/components/common/TextField";

// 인증번호 유효시간 5분(05:00)
const CODE_SECONDS = 300;

interface EmailVerifyStepProps {
  onComplete: () => void;
}

export default function EmailVerifyStep({ onComplete }: EmailVerifyStepProps) {
  const [code, setCode] = useState("");
  const [remaining, setRemaining] = useState(CODE_SECONDS);

  useEffect(() => {
    const id = setInterval(() => {
      setRemaining((r) => (r <= 0 ? 0 : r - 1));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const expired = remaining <= 0;
  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");

  const handleResend = () => {
    // TODO: 인증번호 재전송 API (타이머 만료 후 가능 / 1일 최대 10회)
    setRemaining(CODE_SECONDS);
    setCode("");
  };

  const canComplete = code.length === 6 && !expired;

  return (
    <div className="flex flex-1 flex-col px-5 pb-8 pt-5">
      <h2 className="text-heading-20-bd leading-[1.5] text-neutral-1000">
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
            expired ? "인증번호가 만료되었습니다. 재전송해 주세요." : undefined
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

        <p className="mt-5 text-body-14-md-tighter text-neutral-400">
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
        <Button onClick={onComplete} disabled={!canComplete}>
          완료
        </Button>
      </div>
    </div>
  );
}
