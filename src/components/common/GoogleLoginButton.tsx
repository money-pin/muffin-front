import { useEffect, useRef, useState } from "react";

import SocialLoginButton from "./SocialLoginButton";
import { loadGoogleIdentity } from "@/lib/google";

interface GoogleLoginButtonProps {
  label: string;
  onCredential: (idToken: string) => void;
  onError?: (message: string) => void;
}

type GoogleStatus = "loading" | "ready" | "failed";

const UNAVAILABLE_MESSAGE =
  "지금은 구글 로그인을 사용할 수 없어요. 잠시 후 다시 시도해주세요.";
const LOADING_MESSAGE = "구글 로그인을 준비 중이에요. 잠시 후 다시 눌러주세요.";

// Figma 디자인(SocialLoginButton)을 유지하기 위해, 구글이 렌더한 실제 버튼을
// 투명하게 겹쳐 클릭을 위임한다. (One Tap prompt()는 표시가 보장되지 않음)
// 구글 버튼이 준비되기 전에는 아래 버튼이 클릭을 받아 이유를 안내한다. (#286)
export default function GoogleLoginButton({
  label,
  onCredential,
  onError,
}: GoogleLoginButtonProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<GoogleStatus>("loading");
  // 스크립트 로드 실패 후 다시 누르면 재시도한다
  const [attempt, setAttempt] = useState(0);

  // 콜백이 바뀌어도 GIS를 다시 초기화하지 않도록 ref로 최신 값 유지
  const onCredentialRef = useRef(onCredential);
  const onErrorRef = useRef(onError);
  useEffect(() => {
    onCredentialRef.current = onCredential;
    onErrorRef.current = onError;
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
        if (cancelled || !overlayRef.current) return;

        google.accounts.id.initialize({
          client_id: clientId,
          callback: (response) => onCredentialRef.current(response.credential),
        });

        google.accounts.id.renderButton(overlayRef.current, {
          type: "standard",
          size: "large",
          width: 400,
        });

        setStatus("ready");
      })
      .catch((error: Error) => {
        if (cancelled) return;
        console.warn("구글 로그인 스크립트 로드 실패:", error.message);
        setStatus("failed");
      });

    return () => {
      cancelled = true;
    };
  }, [clientId, attempt]);

  const isReady = status === "ready";

  // 마우스·터치 클릭은 준비되면 위에 겹친 구글 버튼이 받는다.
  // 키보드로 이 버튼을 누른 경우 등 준비된 뒤에는 아무것도 하지 않는다.
  const handleUnavailableClick = () => {
    if (isReady) return;

    if (!clientId) {
      onErrorRef.current?.(UNAVAILABLE_MESSAGE);
      return;
    }

    if (status === "failed") {
      onErrorRef.current?.(UNAVAILABLE_MESSAGE);
      setStatus("loading");
      setAttempt((count) => count + 1);
      return;
    }

    onErrorRef.current?.(LOADING_MESSAGE);
  };

  return (
    <div className="relative">
      <SocialLoginButton
        provider="google"
        label={label}
        onClick={handleUnavailableClick}
      />
      {/* 구글 버튼(높이 40px)을 48px 버튼 세로 중앙에 겹쳐 클릭 영역을 맞춘다 */}
      <div
        ref={overlayRef}
        aria-hidden="true"
        className={`absolute inset-0 flex items-center overflow-hidden opacity-0 ${
          isReady ? "" : "pointer-events-none"
        }`}
      />
    </div>
  );
}
