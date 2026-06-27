import { Outlet } from "react-router-dom";

function MobileLayout() {
  return (
    <div className="min-h-dvh bg-white">
      <main className="mx-auto min-h-dvh w-full max-w-[390px] bg-white md:border-x md:border-gray-100">
        <Outlet />
      </main>
    </div>
  );
}

export default MobileLayout;
