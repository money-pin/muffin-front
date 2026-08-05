import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// 라우트(pathname)가 바뀔 때마다 스크롤을 맨 위로 리셋한다.
// 라우터 트리 최상단(공용 레이아웃 안, Routes 근처)에 한 번만 렌더한다.
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
  }, [pathname]);

  return null;
}
