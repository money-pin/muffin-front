import { useLocation, useNavigate } from "react-router-dom";
import homeIcon from "@/assets/icon-24px/home.svg";
import homeActiveIcon from "@/assets/icon-24px/home-active.svg";
import newsIcon from "@/assets/icon-24px/news.svg";
import newsActiveIcon from "@/assets/icon-24px/news-active.svg";
import investmentIcon from "@/assets/icon-24px/investment.svg";
import investmentActiveIcon from "@/assets/icon-24px/investment-active.svg";
import myIcon from "@/assets/icon-24px/my.svg";
import myActiveIcon from "@/assets/icon-24px/my-active.svg";

// Figma: 비활성=아웃라인(회색), 활성=filled(주황 #F46C0E) — 색만이 아니라 아이콘 자체가 교체됨.
// 아이콘 이름은 Figma의 IconHome/IconNews/IconPaperTrading/IconMyPage(+Pr=활성) 매핑.
//⚠️ home icon 추출 시 오류 -> 확인 필요.
const TABS = [
  { label: "홈", path: "/home", Active: homeActiveIcon, Inactive: homeIcon },
  { label: "뉴스", path: "/news", Active: newsActiveIcon, Inactive: newsIcon },
  {
    label: "모의투자",
    path: "/invest",
    Active: investmentActiveIcon,
    Inactive: investmentIcon,
  },
  { label: "마이", path: "/my", Active: myActiveIcon, Inactive: myIcon },
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
            type="button"
            onClick={() => navigate(path)}
            className={`flex h-[60px] w-[60px] flex-col items-center justify-center gap-0.5 ${color}`}
          >
            <img
              src={Icon}
              alt=""
              aria-hidden="true"
              className="h-6 w-6 object-contain"
              draggable={false}
            />
            <span className="text-[10px] font-bold">{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
