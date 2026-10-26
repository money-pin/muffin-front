import { Outlet } from "react-router-dom";
import { useState } from "react";
import BottomNavigation from "@/components/common/BottomNavigation";
import { BottomNavigationVisibilityContext } from "@/layouts/bottomNavigationContext";

function BottomNavLayout() {
  const [isNavigationHidden, setIsNavigationHidden] = useState(false);
  return (
    <BottomNavigationVisibilityContext.Provider value={setIsNavigationHidden}>
      <main className="min-h-dvh pb-[80px]">
        <Outlet />
      </main>

      {!isNavigationHidden && <BottomNavigation />}
    </BottomNavigationVisibilityContext.Provider>
  );
}

export default BottomNavLayout;
