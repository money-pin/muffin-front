import { Navigate, Outlet } from "react-router-dom";

import { isLoggedIn } from "@/lib/auth";

// 이미 로그인한 사용자는 로그인/회원가입 화면 대신 홈으로 보낸다.
export default function RedirectIfAuth() {
  return isLoggedIn() ? <Navigate to="/home" replace /> : <Outlet />;
}
