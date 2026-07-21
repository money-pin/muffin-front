import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Logo from "@/components/common/Logo";
import TextField from "@/components/common/TextField";
import Button from "@/components/common/Button";
import GoogleLoginButton from "@/components/common/GoogleLoginButton";
import { apiRequest } from "@/lib/api";
import { saveAccessToken } from "@/lib/auth";

// POST /api/auth/login, /api/auth/google 공통 응답 result
interface AuthResult {
  accessToken: string;
}

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSubmit =
    email.trim() !== "" && password.trim() !== "" && !isSubmitting;

  // 이메일/비밀번호 로그인. accessToken은 응답 body, refreshToken은 httpOnly 쿠키.
  // 실패 시 백엔드 메시지(코드별 문구)를 그대로 노출한다.
  const handleLogin = async () => {
    if (!canSubmit) return;

    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const { accessToken } = await apiRequest<AuthResult>("/api/auth/login", {
        method: "POST",
        body: { email, password },
      });

      saveAccessToken(accessToken);
      navigate("/home", { replace: true });
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "로그인에 실패했어요. 잠시 후 다시 시도해주세요.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // 구글 ID 토큰을 백엔드에 넘겨 앱 accessToken으로 교환
  // (refreshToken은 백엔드가 httpOnly 쿠키로 내려줌)
  const handleGoogleCredential = async (idToken: string) => {
    setErrorMessage("");

    try {
      const { accessToken } = await apiRequest<AuthResult>("/api/auth/google", {
        method: "POST",
        body: { idToken, termsAgreed: true },
      });

      saveAccessToken(accessToken);
      navigate("/home", { replace: true });
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "구글 로그인에 실패했어요. 잠시 후 다시 시도해주세요.",
      );
    }
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

              <div className="text-body-14-md-tighter flex items-center justify-center gap-4 px-5 text-neutral-700">
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
            <GoogleLoginButton
              onCredential={handleGoogleCredential}
              onError={setErrorMessage}
            />

            <p className="text-caption-12-md-tighter text-center text-neutral-400">
              가입 시 이용약관 및 개인정보처리방침에 동의하는 것으로 간주됩니다.
            </p>

            {errorMessage && (
              <p className="text-caption-12-md-tighter text-positive text-center">
                {errorMessage}
              </p>
            )}
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
