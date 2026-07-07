import { Outlet } from "react-router-dom";

import InvestTabBar from "@/pages/invest/components/InvestTabBar";

export default function InvestLayout() {
  return (
    <>
      <InvestTabBar />
      <Outlet />
    </>
  );
}
