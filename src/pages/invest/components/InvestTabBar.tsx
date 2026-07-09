import { useLocation, useNavigate } from "react-router-dom";

type InvestTab = "invest" | "stats" | "ranking";

const INVEST_TABS = [
  { value: "invest", label: "모의투자" },
  { value: "stats", label: "수익 통계" },
  { value: "ranking", label: "랭킹" },
] as const;

const TAB_PATH_MAP: Record<InvestTab, string> = {
  invest: "/invest",
  stats: "/invest/stats",
  ranking: "/invest/ranking",
};

function getCurrentTab(pathname: string): InvestTab {
  if (pathname.startsWith("/invest/ranking")) return "ranking";
  if (pathname.startsWith("/invest/stats")) return "stats";

  return "invest";
}

export default function InvestTabBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentTab = getCurrentTab(location.pathname);

  return (
    <nav className="sticky top-0 z-10 flex h-12 w-full items-center bg-neutral-0 shadow-[0_4px_2px_rgba(0,0,0,0.05)]">
      {INVEST_TABS.map((tab) => {
        const isActive = tab.value === currentTab;

        return (
          <button
            key={tab.value}
            type="button"
            onClick={() => navigate(TAB_PATH_MAP[tab.value])}
            className="relative flex h-full flex-1 items-center justify-center px-2.5 py-3"
          >
            <span
              className={
                isActive
                  ? "text-body-16-bd-tighter text-primary"
                  : "text-body-16-md-tighter text-neutral-400"
              }
            >
              {tab.label}
            </span>
            {isActive && (
              <span
                aria-hidden="true"
                className="absolute bottom-0 h-0.5 w-full bg-primary"
              />
            )}
          </button>
        );
      })}
    </nav>
  );
}
