import { useState } from "react";
import { useNavigate } from "react-router-dom";

import BottomSheet from "@/components/common/BottomSheet";
import GoogleLoginButton from "@/components/common/GoogleLoginButton";
import SocialLoginButton from "@/components/common/SocialLoginButton";
import { apiRequest } from "@/lib/api";
import { saveAccessToken } from "@/lib/auth";
import { resolveEntryRoute } from "@/lib/mypageApi";

type SocialAuthMode = "signup" | "login";

interface SocialAuthSheetProps {
  isOpen: boolean;
  onClose: () => void;
  mode: SocialAuthMode;
}

const COPY: Record<
  SocialAuthMode,
  { title: [string, string]; action: string; ariaLabel: string }
> = {
  signup: {
    title: ["회원가입을 완료하고", "나만의 머핀을 구워보세요!"],
    action: "계속하기",
    ariaLabel: "회원가입",
  },
  login: {
    title: ["매일 가볍게 즐기는", "주린이를 위한 경제 학습"],
    action: "로그인",
    ariaLabel: "로그인",
  },
};

// POST /auth/google 응답 result
interface AuthResult {
  accessToken: string;
}

type Notice = { tone: "info" | "error"; message: string } | null;

// 소셜 로그인 시트 (Figma 런칭 전 수정: 회원가입·로그인)
// 가입·로그인 모두 같은 API를 쓰고, 이후 분기는 resolveEntryRoute가 맡는다.
// - 처음 가입: 온보딩 미완료 → /onboarding (닉네임부터)
// - 기존 회원: /home
export default function SocialAuthSheet({
  isOpen,
  onClose,
  mode,
}: SocialAuthSheetProps) {
  const navigate = useNavigate();
  // 로그인 결과·준비 중인 소셜 안내 (서버 로그인 실패 포함)
  const [notice, setNotice] = useState<Notice>(null);
  // 구글 로그인 준비 상태 안내 (준비가 끝나면 GoogleLoginButton이 해제)
  const [googleReadinessNotice, setGoogleReadinessNotice] = useState<
    string | null
  >(null);
  const copy = COPY[mode];
  const visibleNotice: Notice =
    notice ??
    (googleReadinessNotice
      ? { tone: "error", message: googleReadinessNotice }
      : null);

  const handleGoogleCredential = async (idToken: string) => {
    setNotice(null);
    setGoogleReadinessNotice(null);

    try {
      const { accessToken } = await apiRequest<AuthResult>("/auth/google", {
        method: "POST",
        body: { idToken },
      });

      saveAccessToken(accessToken);
      const entryRoute = await resolveEntryRoute();
      navigate(entryRoute, { replace: true });
    } catch (error) {
      setNotice({
        tone: "error",
        message:
          error instanceof Error
            ? error.message
            : "구글 로그인에 실패했어요. 잠시 후 다시 시도해주세요.",
      });
    }
  };

  // TODO(#279): 카카오·애플 로그인 API 연동 후 교체
  const showUnavailable = (providerName: string) => {
    setGoogleReadinessNotice(null);
    setNotice({
      tone: "info",
      message: `${providerName} 로그인은 준비 중이에요.`,
    });
  };

  const handleClose = () => {
    setNotice(null);
    setGoogleReadinessNotice(null);
    onClose();
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={handleClose}
      ariaLabel={copy.ariaLabel}
    >
      <div className="flex flex-col items-center gap-4 px-[21px] pb-[60px]">
        <h2 className="text-heading-20-bd text-center text-neutral-900">
          {copy.title[0]}
          <br />
          {copy.title[1]}
        </h2>

        <div className="flex w-full flex-col gap-2">
          <SocialLoginButton
            provider="kakao"
            label={`Kakao로 ${copy.action}`}
            onClick={() => showUnavailable("카카오")}
          />
          <SocialLoginButton
            provider="apple"
            label={`Apple로 ${copy.action}`}
            onClick={() => showUnavailable("애플")}
          />
          <GoogleLoginButton
            label={`Google로 ${copy.action}`}
            onCredential={handleGoogleCredential}
            onReadinessNotice={(message) => {
              // 구글 버튼을 누른 경우 가장 최근 안내만 보이도록 이전 안내를 지운다
              if (message) setNotice(null);
              setGoogleReadinessNotice(message);
            }}
          />
        </div>

        <p className="text-caption-12-md-tighter text-center text-neutral-400">
          회원가입 시 이용약관 및 개인정보 처리방침에 동의합니다.
        </p>

        {visibleNotice && (
          <p
            role="status"
            className={`text-caption-12-md-tighter text-center ${
              visibleNotice.tone === "error"
                ? "text-positive"
                : "text-neutral-600"
            }`}
          >
            {visibleNotice.message}
          </p>
        )}
      </div>
    </BottomSheet>
  );
}
