import { useLayoutEffect, useRef } from "react";
import { Outlet } from "react-router-dom";

import InvestHeader from "@/pages/invest/components/InvestHeader";

export default function InvestLayout() {
  const layoutRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const layout = layoutRef.current;
    const summary = layout?.querySelector<HTMLElement>(
      "[data-invest-summary-header]",
    );
    if (!layout || !summary) return;
    const updateHeight = () => {
      layout.style.setProperty(
        "--invest-summary-height",
        `${summary.offsetHeight}px`,
      );
    };
    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    observer.observe(summary);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={layoutRef}
      className="flex min-h-dvh flex-col has-[[data-invest-trade]]:min-h-[calc(100dvh+var(--invest-summary-height,0px)-80px)]"
    >
      <InvestHeader />

      <main className="flex flex-1 flex-col">
        <Outlet />
      </main>
    </div>
  );
}
