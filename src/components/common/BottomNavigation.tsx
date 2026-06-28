import { useLocation, useNavigate } from "react-router-dom";
import {
  IoHome,
  IoHomeOutline,
  IoNewspaper,
  IoNewspaperOutline,
  IoStatsChart,
  IoStatsChartOutline,
  IoPerson,
  IoPersonOutline,
} from "react-icons/io5";

// Figma: 비활성=아웃라인(회색), 활성=filled(주황 #F46C0E) — 색만이 아니라 아이콘 자체가 교체됨.
// 아이콘 이름은 Figma의 IconHome/IconNews/IconPaperTrading/IconMyPage(+Pr=활성) 매핑.
// ⚠️ react-icons(Ionicons) 근사치 — 디자이너 SVG 받으면 1:1 교체 예정.
const TABS = [
  { label: "홈", path: "/home", Active: IoHome, Inactive: IoHomeOutline },
  { label: "뉴스", path: "/news", Active: IoNewspaper, Inactive: IoNewspaperOutline },
  { label: "모의투자", path: "/invest", Active: IoStatsChart, Inactive: IoStatsChartOutline },
  { label: "마이", path: "/my", Active: IoPerson, Inactive: IoPersonOutline },
];

export default function BottomNavigation() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 h-[92px] w-full max-w-[390px] bg-white border-t border-[#D9D9D9] flex justify-between items-start px-8 pt-1">
      {TABS.map(({ label, path, Active, Inactive }) => {
        const active = location.pathname === path;
        const Icon = active ? Active : Inactive;
        const color = active ? "text-[#F46C0E]" : "text-[#999999]";
        return (
          <button
            key={path}
            onClick={() => navigate(path)}
            className={`flex h-[60px] w-[60px] flex-col items-center justify-center gap-0.5 ${color}`}
          >
            <Icon size={24} />
            <span className="text-[10px] font-bold">{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
