import { Navigate, Outlet } from "react-router-dom";

import { isLoggedIn } from "@/lib/auth";

// 로그인해야 접근 가능한 라우트 가드. 미로그인 시 /login으로 보낸다.
export default function RequireAuth() {
  return isLoggedIn() ? <Outlet /> : <Navigate to="/login" replace />;
}
