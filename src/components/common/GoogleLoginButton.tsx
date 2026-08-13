import { useEffect, useRef, useState } from "react";

import SocialLoginButton from "./SocialLoginButton";
import { loadGoogleIdentity } from "@/lib/google";

interface GoogleLoginButtonProps {
  onCredential: (idToken: string) => void;
  onError?: (message: string) => void;
}

// Figma 디자인(SocialLoginButton)을 유지하기 위해, 구글이 렌더한 실제 버튼을
// 투명하게 겹쳐 클릭을 위임한다. (One Tap prompt()는 표시가 보장되지 않음)
export default function GoogleLoginButton({
  onCredential,
  onError,
}: GoogleLoginButtonProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);

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

        setIsReady(true);
      })
      .catch((error: Error) => {
        if (!cancelled) onErrorRef.current?.(error.message);
      });

    return () => {
      cancelled = true;
    };
  }, [clientId]);

  return (
    <div className="relative">
      <SocialLoginButton />
      <div
        ref={overlayRef}
        aria-hidden="true"
        className={`absolute inset-0 overflow-hidden opacity-0 ${
          isReady ? "" : "pointer-events-none"
        }`}
      />
    </div>
  );
}
