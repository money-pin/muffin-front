import { Outlet } from "react-router-dom";

function MobileLayout() {
  return (
    <div className="min-h-dvh bg-white">
      <div className="mx-auto min-h-dvh w-full max-w-[--max-width-app] bg-white md:border-x md:border-gray-100">
        <Outlet />
      </div>
    </div>
  );
}

export default MobileLayout;
