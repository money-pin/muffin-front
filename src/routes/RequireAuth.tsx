import { Navigate, Outlet } from "react-router-dom";

import { isLoggedIn } from "@/lib/auth";

// 로그인해야 접근 가능한 라우트 가드. 미로그인 시 스플래시로 보낸다
// (스플래시가 2.2초 뒤 자동으로 /login으로 이동).
export default function RequireAuth() {
  return isLoggedIn() ? <Outlet /> : <Navigate to="/splash" replace />;
}
