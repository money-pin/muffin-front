import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Logo from "@/components/common/Logo";
import TextField from "@/components/common/TextField";
import Button from "@/components/common/Button";
import SocialLoginButton from "@/components/common/SocialLoginButton";

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const canSubmit = email.trim() !== "" && password.trim() !== "";

  const handleLogin = () => {
    // TODO: 로그인 API 연결
    navigate("/home");
  };

  const handleGoogleLogin = () => {
    // TODO: 구글 소셜 로그인 연결
  };

  return (
    <div className="flex min-h-dvh flex-col justify-between">
      <div className="flex flex-col gap-4">
        <div className="flex justify-center py-7">
          <Logo size="sm" />
        </div>

        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-4 px-5">
              <TextField
                label="이메일"
                type="email"
                placeholder="example@email.com"
                value={email}
                onChange={setEmail}
              />
              <TextField
                label="비밀번호"
                type="password"
                placeholder="비밀번호를 입력해주세요."
                value={password}
                onChange={setPassword}
              />
            </div>

            <div className="flex flex-col gap-4">
              <div className="px-5">
                <Button onClick={handleLogin} disabled={!canSubmit}>
                  로그인
                </Button>
              </div>

              <div className="flex items-center justify-center gap-4 px-5 text-body-14-md-tighter text-neutral-700">
                <button type="button" className="flex-1 text-right">
                  계정 찾기
                </button>
                <span className="h-3 w-px shrink-0 bg-neutral-100" />
                <button type="button" className="flex-1 text-left">
                  비밀번호 찾기
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-5 px-5">
            <div className="flex items-center gap-2">
              <div className="h-px flex-1 bg-neutral-100" />
              <span className="text-caption-12-md-tighter text-neutral-400">
                또는
              </span>
              <div className="h-px flex-1 bg-neutral-100" />
            </div>
            <SocialLoginButton onClick={handleGoogleLogin} />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 px-5 py-3">
        <span className="text-body-14-md-tighter text-neutral-400">
          아직 회원이 아니신가요?
        </span>
        <button
          type="button"
          onClick={() => navigate("/signup")}
          className="text-body-14-bd text-primary underline"
        >
          회원가입
        </button>
      </div>
    </div>
  );
}

export default LoginPage;
