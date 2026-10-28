import SocialLoginButton from "./SocialLoginButton";
import { startGoogleLogin } from "@/lib/google";

interface GoogleLoginButtonProps {
  label: string;
  // 구글 로그인을 시작할 수 없을 때 안내 (Client ID 미설정 등)
  onUnavailable?: (message: string) => void;
}

const UNAVAILABLE_MESSAGE =
  "지금은 구글 로그인을 사용할 수 없어요. 잠시 후 다시 시도해주세요.";

// Figma 디자인 버튼. 누르면 구글 로그인 페이지로 이동한다. (#291)
// 로그인 결과는 GoogleCallbackPage(/auth/google/callback)에서 처리한다.
export default function GoogleLoginButton({
  label,
  onUnavailable,
}: GoogleLoginButtonProps) {
  const handleClick = () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) {
      console.warn(
        "VITE_GOOGLE_CLIENT_ID가 설정되지 않아 구글 로그인을 시작하지 않습니다.",
      );
      onUnavailable?.(UNAVAILABLE_MESSAGE);
      return;
    }

    try {
      startGoogleLogin(clientId);
    } catch (error) {
      // sessionStorage를 쓸 수 없는 환경 등
      console.warn("구글 로그인 시작 실패:", error);
      onUnavailable?.(UNAVAILABLE_MESSAGE);
    }
  };

  return (
    <SocialLoginButton provider="google" label={label} onClick={handleClick} />
  );
}
