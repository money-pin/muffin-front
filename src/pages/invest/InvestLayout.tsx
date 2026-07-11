import { Outlet } from "react-router-dom";

import InvestHeader from "@/pages/invest/components/InvestHeader";

export default function InvestLayout() {
  return (
    <div className="flex min-h-dvh flex-col">
      <InvestHeader />

      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
    </div>
  );
}
