import { useEffect, useRef, useState } from "react";

import SocialLoginButton from "./SocialLoginButton";
import { loadGoogleIdentity } from "@/lib/google";

interface GoogleLoginButtonProps {
  label: string;
  onCredential: (idToken: string) => void;
  // 구글 로그인 준비 상태 안내. 준비가 끝나면 null로 해제한다.
  // 서버 로그인 실패 안내와 섞이지 않도록 별도로 전달한다.
  onReadinessNotice?: (message: string | null) => void;
}

type GoogleStatus = "loading" | "ready" | "failed";

const UNAVAILABLE_MESSAGE =
  "지금은 구글 로그인을 사용할 수 없어요. 잠시 후 다시 시도해주세요.";
const LOADING_MESSAGE = "구글 로그인을 준비 중이에요. 잠시 후 다시 눌러주세요.";

// Figma 디자인(SocialLoginButton)을 유지하기 위해, 구글이 렌더한 실제 버튼을
// 투명하게 겹쳐 클릭을 위임한다. (One Tap prompt()는 표시가 보장되지 않음)
// - 준비 전: 아래 커스텀 버튼이 클릭·키보드 입력을 받아 이유를 안내한다. (#286)
// - 준비 후: 구글 버튼이 마우스·터치·키보드 입력을 모두 받는다. 커스텀 버튼은
//   포커스·스크린리더에서 빠지고, 키보드 포커스 표시는 바깥 래퍼가 그린다.
export default function GoogleLoginButton({
  label,
  onCredential,
  onReadinessNotice,
}: GoogleLoginButtonProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
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
        if (cancelled || !overlayRef.current) return;

        google.accounts.id.initialize({
          client_id: clientId,
          callback: (response) => onCredentialRef.current(response.credential),
        });

        google.accounts.id.renderButton(overlayRef.current, {
          type: "standard",
          size: "large",
          width: 400,
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
  }, [clientId, attempt]);

  const isReady = status === "ready";

  // 준비 전에만 호출된다 (준비 후에는 구글 버튼이 위를 덮고 이 버튼은 포커스에서 빠짐)
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
    <div className="has-[:focus-visible]:outline-primary relative rounded-[30px] has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2">
      <SocialLoginButton
        provider="google"
        label={label}
        onClick={isReady ? undefined : handleUnavailableClick}
        tabIndex={isReady ? -1 : undefined}
        aria-hidden={isReady || undefined}
        className="focus-visible:outline-none"
      />
      {/* 구글 버튼(높이 40px)을 48px 버튼 세로 중앙에 겹쳐 클릭 영역을 맞춘다 */}
      <div
        ref={overlayRef}
        aria-hidden={isReady ? undefined : true}
        className={`absolute inset-0 flex items-center overflow-hidden opacity-0 ${
          isReady ? "" : "pointer-events-none"
        }`}
      />
    </div>
  );
}
