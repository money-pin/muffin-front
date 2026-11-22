import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { isLoggedIn } from "@/lib/auth";
import {
  rememberNotificationDestination,
  resolveNotificationDestination,
} from "@/lib/notificationNavigation";

// 웹 서비스 워커·네이티브 수신 모듈의 공통 진입점. url은 반드시 허용 경로로 검증한다.
export default function NotificationOpenPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const destination = resolveNotificationDestination(
    params.get("url"),
    window.location.origin,
  );
  useEffect(() => {
    if (!destination) {
      navigate("/home", { replace: true });
      return;
    }
    if (isLoggedIn()) navigate(destination, { replace: true });
    else {
      rememberNotificationDestination(destination);
      navigate("/login", { replace: true });
    }
  }, [destination, navigate]);
  return null;
}
