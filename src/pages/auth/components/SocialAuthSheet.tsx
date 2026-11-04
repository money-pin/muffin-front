import { useState } from "react";
import { useNavigate } from "react-router-dom";

import BottomSheet from "@/components/common/BottomSheet";
import GoogleLoginButton from "@/components/common/GoogleLoginButton";
import SocialLoginButton from "@/components/common/SocialLoginButton";
import { resolveEntryRoute } from "@/lib/mypageApi";
import {
  isNativeApp,
  loginWithAppleNative,
  loginWithGoogleNative,
  loginWithKakaoNative,
  SocialLoginCancelledError,
} from "@/lib/socialLogin";

type SocialAuthMode = "signup" | "login";

interface SocialAuthSheetProps {
  isOpen: boolean;
  onClose: () => void;
  mode: SocialAuthMode;
  // 시트를 열 때 바로 보여줄 안내 (구글 로그인 실패 후 돌아온 경우)
  initialNotice?: string;
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

type Notice = { tone: "info" | "error"; message: string } | null;

// 소셜 로그인 시트 (Figma 런칭 전 수정: 회원가입·로그인)
// 가입·로그인 모두 같은 API를 쓰고, 이후 분기는 resolveEntryRoute가 맡는다.
// - 처음 가입: 온보딩 미완료 → /onboarding (닉네임부터)
// - 기존 회원: /home
// - iOS 앱: 카카오·애플·구글 모두 앱 SDK로 로그인 (#266)
// - 웹: 구글만 로그인 페이지로 이동했다가 GoogleCallbackPage에서 마무리 (#291).
//   카카오·애플은 백엔드가 앱에서 발급된 토큰만 받아 앱에서만 지원한다.
export default function SocialAuthSheet({
  isOpen,
  onClose,
  mode,
  initialNotice,
}: SocialAuthSheetProps) {
  const [notice, setNotice] = useState<Notice>(
    initialNotice ? { tone: "error", message: initialNotice } : null,
  );
  const copy = COPY[mode];

  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isNative = isNativeApp();

  const runNativeLogin = async (login: () => Promise<void>) => {
    if (isSubmitting) return;
    setNotice(null);
    setIsSubmitting(true);
    try {
      await login();
      navigate(await resolveEntryRoute(), { replace: true });
    } catch (error) {
      if (!(error instanceof SocialLoginCancelledError)) {
        setNotice({
          tone: "error",
          message:
            error instanceof Error && error.message
              ? error.message
              : "로그인에 실패했어요. 잠시 후 다시 시도해주세요.",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const showAppOnly = (providerName: string) => {
    setNotice({
      tone: "info",
      message: `${providerName} 로그인은 머핀 앱에서 이용할 수 있어요.`,
    });
  };

  const handleClose = () => {
    setNotice(null);
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
            disabled={isSubmitting}
            onClick={() =>
              isNative
                ? void runNativeLogin(loginWithKakaoNative)
                : showAppOnly("카카오")
            }
          />
          <SocialLoginButton
            provider="apple"
            label={`Apple로 ${copy.action}`}
            disabled={isSubmitting}
            onClick={() =>
              isNative
                ? void runNativeLogin(loginWithAppleNative)
                : showAppOnly("애플")
            }
          />
          {isNative ? (
            <SocialLoginButton
              provider="google"
              label={`Google로 ${copy.action}`}
              disabled={isSubmitting}
              onClick={() => void runNativeLogin(loginWithGoogleNative)}
            />
          ) : (
            <GoogleLoginButton
              label={`Google로 ${copy.action}`}
              onUnavailable={(message) => setNotice({ tone: "error", message })}
            />
          )}
        </div>

        <p className="text-caption-12-md-tighter text-center text-neutral-400">
          회원가입 시 이용약관 및 개인정보 처리방침에 동의합니다.
        </p>

        {notice && (
          <p
            role="status"
            className={`text-caption-12-md-tighter text-center ${
              notice.tone === "error" ? "text-positive" : "text-neutral-600"
            }`}
          >
            {notice.message}
          </p>
        )}
      </div>
    </BottomSheet>
  );
}
