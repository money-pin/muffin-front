import { useLocation, useNavigate } from "react-router-dom";

import TabBar from "@/components/common/TabBar";

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
    <TabBar
      tabs={INVEST_TABS}
      currentTab={currentTab}
      onTabChange={(tab) => navigate(TAB_PATH_MAP[tab])}
      className="bg-neutral-0"
    />
  );
}
