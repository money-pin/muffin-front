import { useEffect, useRef, useState } from "react";

import SocialLoginButton from "./SocialLoginButton";
import { loadGoogleIdentity } from "@/lib/google";

interface GoogleLoginButtonProps {
  // 구글 버튼이 준비되기 전 자리 표시 버튼의 문구
  label: string;
  // 구글 버튼 문구: 로그인("Google 계정으로 로그인") / 가입("Google 계정으로 계속하기")
  text?: "signin_with" | "continue_with";
  onCredential: (idToken: string) => void;
  // 구글 로그인 준비 상태 안내. 준비가 끝나면 null로 해제한다.
  // 서버 로그인 실패 안내와 섞이지 않도록 별도로 전달한다.
  onReadinessNotice?: (message: string | null) => void;
}

type GoogleStatus = "loading" | "ready" | "failed";

const UNAVAILABLE_MESSAGE =
  "지금은 구글 로그인을 사용할 수 없어요. 잠시 후 다시 시도해주세요.";
const LOADING_MESSAGE = "구글 로그인을 준비 중이에요. 잠시 후 다시 눌러주세요.";

// 구글 버튼 width 옵션 허용 범위
const GOOGLE_BUTTON_MIN_WIDTH = 200;
const GOOGLE_BUTTON_MAX_WIDTH = 400;

// 구글이 렌더한 실제 버튼을 그대로 보여준다. (#289)
// 구글 버튼 iframe은 클릭재킹 방지를 위해 투명하거나 가려진 상태의 클릭을 무시하므로,
// 커스텀 버튼 위에 투명하게 겹치는 방식은 쓰지 않는다.
// - 준비 전: 같은 자리에 커스텀 버튼을 보여주고, 누르면 이유를 안내한다. (#286)
// - 준비 후: 구글 버튼(흰 바탕·테두리·둥근 모양)이 마우스·터치·키보드 입력을 받는다.
export default function GoogleLoginButton({
  label,
  text = "signin_with",
  onCredential,
  onReadinessNotice,
}: GoogleLoginButtonProps) {
  const buttonContainerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<GoogleStatus>("loading");
  // 스크립트 로드 실패 후 다시 누르면 재시도한다
  const [attempt, setAttempt] = useState(0);

  // 콜백이 바뀌어도 GIS를 다시 초기화하지 않도록 ref로 최신 값 유지
  const onCredentialRef = useRef(onCredential);
  const onReadinessNoticeRef = useRef(onReadinessNotice);
  useEffect(() => {
    onCredentialRef.current = onCredential;
    onReadinessNoticeRef.current = onReadinessNotice;
  });

  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  useEffect(() => {
    if (!clientId) {
      console.warn(
        "VITE_GOOGLE_CLIENT_ID가 설정되지 않아 구글 로그인을 초기화하지 않습니다.",
      );
      return;
    }

    let cancelled = false;

    loadGoogleIdentity()
      .then((google) => {
        const container = buttonContainerRef.current;
        if (cancelled || !container) return;

        google.accounts.id.initialize({
          client_id: clientId,
          callback: (response) => onCredentialRef.current(response.credential),
        });

        // 다른 소셜 버튼과 같은 너비로 맞춘다
        const width = Math.min(
          GOOGLE_BUTTON_MAX_WIDTH,
          Math.max(GOOGLE_BUTTON_MIN_WIDTH, container.clientWidth),
        );
        container.replaceChildren();
        google.accounts.id.renderButton(container, {
          type: "standard",
          theme: "outline",
          size: "large",
          shape: "pill",
          text,
          logo_alignment: "center",
          width,
          locale: "ko",
        });

        setStatus("ready");
        // 로딩 중·실패 후 재시도 때 띄운 안내는 준비가 끝나면 지운다
        onReadinessNoticeRef.current?.(null);
      })
      .catch((error: Error) => {
        if (cancelled) return;
        console.warn("구글 로그인 스크립트 로드 실패:", error.message);
        setStatus("failed");
      });

    return () => {
      cancelled = true;
    };
  }, [clientId, text, attempt]);

  const isReady = status === "ready";

  // 준비 전에만 보이는 자리 표시 버튼의 클릭 처리
  const handleUnavailableClick = () => {
    const notify = onReadinessNoticeRef.current;

    if (!clientId) {
      notify?.(UNAVAILABLE_MESSAGE);
      return;
    }

    if (status === "failed") {
      notify?.(UNAVAILABLE_MESSAGE);
      setStatus("loading");
      setAttempt((count) => count + 1);
      return;
    }

    notify?.(LOADING_MESSAGE);
  };

  return (
    <div className="relative">
      {/* 구글 버튼(높이 40px)을 다른 소셜 버튼 높이(48px)의 자리 가운데에 둔다 */}
      <div
        ref={buttonContainerRef}
        aria-hidden={isReady ? undefined : true}
        className={`flex h-12 w-full items-center justify-center ${
          isReady ? "" : "invisible"
        }`}
      />
      {!isReady && (
        <div className="absolute inset-0">
          <SocialLoginButton
            provider="google"
            label={label}
            onClick={handleUnavailableClick}
          />
        </div>
      )}
    </div>
  );
}
