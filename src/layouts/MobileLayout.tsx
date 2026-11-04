import { Outlet, useMatches } from "react-router-dom";
import ScrollToTop from "@/routes/ScrollToTop";

// 라우트 handle로 화면별 Safe Area 처리 방식을 지정한다 (#271)
// - fullBleed: 상태바 영역까지 직접 그리는 화면 (Figma 좌표가 상태바를 포함). 상단 여백 없음
// - statusBarBg: 상태바 뒤 배경색. 기본은 흰색이고, 화면 배경이 다르면 맞춘다
export interface SafeAreaHandle {
  fullBleed?: boolean;
  statusBarBg?: string;
}

function useSafeAreaHandle(): SafeAreaHandle {
  const matches = useMatches();
  for (let index = matches.length - 1; index >= 0; index -= 1) {
    const handle = matches[index].handle as SafeAreaHandle | undefined;
    if (handle?.fullBleed !== undefined || handle?.statusBarBg) return handle;
  }
  return {};
}

function MobileLayout() {
  const { fullBleed = false, statusBarBg = "var(--color-neutral-0)" } =
    useSafeAreaHandle();

  return (
    <div
      className={`min-h-dvh bg-white ${fullBleed ? "" : "pt-[var(--safe-top)]"}`}
    >
      <ScrollToTop />
      {/* iOS 앱에서 스크롤된 내용이 상태바 뒤로 비치지 않게 가린다. 웹에서는 높이 0 */}
      {!fullBleed && (
        <div
          aria-hidden="true"
          style={{ backgroundColor: statusBarBg }}
          className="fixed top-0 left-1/2 z-40 h-[var(--safe-top)] w-full max-w-[var(--max-width-app)] -translate-x-1/2"
        />
      )}
      <div className="mx-auto min-h-dvh w-full max-w-[var(--max-width-app)] bg-white">
        <Outlet />
      </div>
    </div>
  );
}

export default MobileLayout;
