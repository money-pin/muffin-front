import { Outlet, useNavigate } from "react-router-dom";
import {
  useCallback,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

import TopBar from "@/components/common/TopBar";

export interface TopBarOptions {
  title?: string;
  showBack?: boolean;
  onBack?: () => void; // 지정 시 뒤로가기 동작 override (기본: history back)
  rightIcon?: ReactNode;
  background?: "white" | "transparent";
}

export interface TopBarOutletContext {
  setTopBar: Dispatch<SetStateAction<TopBarOptions>>;
  resetTopBar: () => void;
}

function TopBarLayout() {
  const navigate = useNavigate();
  const [topBar, setTopBar] = useState<TopBarOptions>({});

  const resetTopBar = useCallback(() => {
    setTopBar({});
  }, []);

  const outletContext = useMemo(
    () => ({
      setTopBar,
      resetTopBar,
    }),
    [resetTopBar],
  );

  const bgClass =
    topBar.background === "transparent" ? "bg-transparent" : "bg-white";

  return (
    <>
      <div
        className={`fixed top-0 left-1/2 z-50 w-full max-w-[var(--max-width-app)] -translate-x-1/2 ${bgClass}`}
      >
        <TopBar
          title={topBar.title}
          showBack={topBar.showBack}
          onBack={topBar.onBack ?? (() => navigate(-1))}
          rightIcon={topBar.rightIcon}
          background={topBar.background}
        />
      </div>

      <main className="min-h-dvh pt-14">
        <Outlet context={outletContext} />
      </main>
    </>
  );
}

export default TopBarLayout;
