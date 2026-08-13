import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Logo from "@/components/common/Logo";

// 스플래시: 로고+태그라인 중앙 정렬 후 로그인 화면으로 자동 이동
const SPLASH_DURATION_MS = 2200;

function SplashPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/login", { replace: true });
    }, SPLASH_DURATION_MS);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-white">
      <div className="animate-splash-logo">
        <Logo tagline />
      </div>
    </div>
  );
}

export default SplashPage;
