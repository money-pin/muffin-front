import { Outlet } from "react-router-dom";

import InvestHeader from "@/pages/invest/components/InvestHeader";

export default function InvestLayout() {
  return (
    <>
      <InvestHeader />
      <Outlet />
    </>
  );
}
