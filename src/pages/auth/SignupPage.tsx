import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

import type { TopBarOutletContext } from "@/layouts/TopBarLayout";
import TextField from "@/components/common/TextField";
import Button from "@/components/common/Button";
import chevronRightIcon from "@/assets/icon-24px/chevron-right.svg";

function SignupPage() {
  const navigate = useNavigate();
  const { setTopBar, resetTopBar } = useOutletContext<TopBarOutletContext>();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [agreed, setAgreed] = useState(false);

  useEffect(() => {
    setTopBar({ title: "가입하기", showBack: true, background: "white" });
    return () => resetTopBar();
  }, [setTopBar, resetTopBar]);

  const passwordMismatch =
    passwordConfirm !== "" && password !== passwordConfirm;

  const canSubmit =
    name.trim() !== "" &&
    email.trim() !== "" &&
    password.trim() !== "" &&
    passwordConfirm.trim() !== "" &&
    !passwordMismatch &&
    agreed;

  const handleNext = () => {
    // TODO: 회원가입 API 연결 / 다음 스텝 이동
    navigate("/onboarding");
  };

  return (
    <div className="flex min-h-[calc(100dvh-118px)] flex-col px-5 pb-8">
      <div className="flex flex-col gap-6">
        <TextField
          label="이름"
          required
          placeholder="홍길동"
          value={name}
          onChange={setName}
        />
        <TextField
          label="이메일"
          type="email"
          required
          placeholder="example@email.com"
          value={email}
          onChange={setEmail}
        />
        <TextField
          label="비밀번호"
          type="password"
          required
          placeholder="8자 이상 입력해주세요."
          hint="영문, 숫자를 포함한 8-16 조합으로 입력해주세요."
          value={password}
          onChange={setPassword}
        />
        <TextField
          label="비밀번호 재입력"
          type="password"
          required
          placeholder="다시 한번 입력해주세요."
          value={passwordConfirm}
          onChange={setPasswordConfirm}
          error={passwordMismatch ? "비밀번호가 일치하지 않습니다." : undefined}
        />
      </div>

      <div className="mt-auto flex flex-col gap-5 pt-8">
        <button
          type="button"
          onClick={() => setAgreed((v) => !v)}
          className="flex items-center gap-2"
        >
          <span
            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-[4px] border transition-colors ${
              agreed
                ? "border-primary bg-primary"
                : "border-neutral-100 bg-white"
            }`}
          >
            {agreed && (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
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
          <span className="flex-1 text-left text-body-14-md text-neutral-700">
            개인정보처리방침 동의 <span className="text-primary">(필수)</span>
          </span>
          <img
            src={chevronRightIcon}
            alt=""
            aria-hidden="true"
            className="h-6 w-6"
            draggable={false}
          />
        </button>

        <Button onClick={handleNext} disabled={!canSubmit}>
          다음
        </Button>
      </div>
    </div>
  );
}

export default SignupPage;
