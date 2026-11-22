import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { rememberNotificationDestination } from "@/lib/notificationNavigation";

import { isLoggedIn } from "@/lib/auth";

// 로그인해야 접근 가능한 라우트 가드. 미로그인 시 스플래시로 보낸다
// (스플래시가 2.2초 뒤 자동으로 /login으로 이동).
export default function RequireAuth() {
  const location = useLocation();
  const loggedIn = isLoggedIn();
  useEffect(() => {
    if (!loggedIn)
      rememberNotificationDestination(location.pathname + location.search);
  }, [loggedIn, location.pathname, location.search]);
  return loggedIn ? <Outlet /> : <Navigate to="/splash" replace />;
}
