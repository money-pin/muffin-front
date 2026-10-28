import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { apiRequest } from "@/lib/api";
import { saveAccessToken } from "@/lib/auth";
import { readGoogleCallback } from "@/lib/google";
import { resolveEntryRoute } from "@/lib/mypageApi";

// POST /auth/google 응답 result
interface AuthResult {
  accessToken: string;
}

export interface AuthErrorState {
  authError: string;
}

const DEFAULT_ERROR_MESSAGE =
  "구글 로그인에 실패했어요. 잠시 후 다시 시도해주세요.";

// 구글 로그인 후 돌아오는 화면 (#291)
// ID 토큰을 앱 토큰으로 바꾼 뒤 처음 가입이면 /onboarding, 기존 회원이면 /home으로 보낸다.
// 실패하면 로그인 시트를 열고 이유를 보여준다. 처리 중에는 빈 화면만 둔다.
// 모든 이동은 replace라 토큰이 담긴 콜백 주소는 방문 기록에 남지 않는다.
export default function GoogleCallbackPage() {
  const navigate = useNavigate();
  // 개발 모드(StrictMode)에서 effect가 두 번 실행돼도 한 번만 처리한다
  const hasStartedRef = useRef(false);

  useEffect(() => {
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;

    const completeLogin = async () => {
      try {
        const idToken = readGoogleCallback(window.location.hash);
        const { accessToken } = await apiRequest<AuthResult>("/auth/google", {
          method: "POST",
          body: { idToken },
        });

        saveAccessToken(accessToken);
        navigate(await resolveEntryRoute(), { replace: true });
      } catch (error) {
        const state: AuthErrorState = {
          authError:
            error instanceof Error && error.message
              ? error.message
              : DEFAULT_ERROR_MESSAGE,
        };
        navigate("/login", { replace: true, state });
      }
    };

    void completeLogin();
  }, [navigate]);

  // 화면에는 아무것도 그리지 않고, 스크린리더에만 처리 중임을 알린다 (#296)
  return (
    <main aria-busy="true" className="min-h-dvh bg-white">
      <span className="sr-only" role="status">
        로그인 중
      </span>
    </main>
  );
}
