import { Outlet } from "react-router-dom";

import InvestHeader from "@/pages/invest/components/InvestHeader";

export default function InvestLayout() {
  return (
    <div className="flex min-h-dvh flex-col">
      <InvestHeader />

      <main className="flex-1 bg-[var(--color-neutral-50)] px-5 py-5">
        <Outlet />
      </main>
    </div>
  );
}
