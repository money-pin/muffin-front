import { Outlet } from "react-router-dom";
import ScrollToTop from "@/routes/ScrollToTop";

function MobileLayout() {
  return (
    <div className="min-h-dvh bg-white">
      <ScrollToTop />
      <div className="mx-auto min-h-dvh w-full max-w-[var(--max-width-app)] bg-white md:border-x md:border-gray-100">
        <Outlet />
      </div>
    </div>
  );
}

export default MobileLayout;
