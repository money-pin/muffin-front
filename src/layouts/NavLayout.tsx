import { Outlet } from "react-router-dom";
import BottomNavigation from "@/components/common/BottomNavigation";

function BottomNavLayout() {
  return (
    <>
      <main className="min-h-dvh pb-[80px]">
        <Outlet />
      </main>

      <BottomNavigation />
    </>
  );
}

export default BottomNavLayout;
