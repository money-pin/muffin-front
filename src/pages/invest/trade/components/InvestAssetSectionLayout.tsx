import { useLayoutEffect, useRef, useState } from "react";
import type { ReactNode, RefObject } from "react";

interface InvestAssetSectionLayoutProps {
  hasSelection: boolean;
  onReadyChange: (ready: boolean) => void;
  controlsRef: RefObject<HTMLDivElement | null>;
  children: ReactNode;
}

const CONTROLS_CLEARANCE = 16;

// 수량 바가 처음 열릴 때 현재 보이는 공간으로 압축 여부를 결정한다.
// 카드 전환·일반 스크롤에는 기존 배치를 유지한다.
function InvestAssetSectionLayout({
  hasSelection,
  onReadyChange,
  controlsRef,
  children,
}: InvestAssetSectionLayoutProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isCompact, setIsCompact] = useState(false);

  useLayoutEffect(() => {
    let frame = 0;
    let active = true;
    let previousWidth = window.innerWidth;
    const desktop = window.matchMedia("(hover: hover) and (pointer: fine)");

    const measure = () => {
      const container = containerRef.current;
      const controls = controlsRef.current;
      if (!container || !controls) return;

      // fr 비율 대신 실제 제목 높이를 고정해 카드 행이 일정한 곡선으로 이동하게 한다.
      const headings = [...container.querySelectorAll("h2")];
      let titleHeight = 0;
      for (const heading of headings) {
        const height = heading.getBoundingClientRect().height;
        titleHeight += height;
        heading
          .closest<HTMLElement>("[data-invest-section-heading]")
          ?.style.setProperty("--invest-title-height", `${height}px`);
      }
      if (!hasSelection) {
        setIsCompact(false);
        onReadyChange(false);
        return;
      }

      const viewport = window.visualViewport;
      const viewportTop = viewport?.offsetTop ?? 0;
      const viewportBottom = viewport
        ? viewportTop + viewport.height
        : window.innerHeight;
      const stickyTabs = document.querySelector<HTMLElement>(
        "[data-invest-sticky-tabs]",
      );
      const contentTop = Math.max(
        container.getBoundingClientRect().top,
        viewportTop,
        stickyTabs?.getBoundingClientRect().bottom ?? viewportTop,
      );
      const availableHeight =
        Math.min(controls.getBoundingClientRect().top, viewportBottom) -
        contentTop -
        CONTROLS_CLEARANCE;
      const rows = [
        ...container.querySelectorAll<HTMLElement>("[data-invest-card-row]"),
      ];
      const cardsHeight = rows.reduce(
        (height, row) => height + row.getBoundingClientRect().height,
        0,
      );
      const rowGap = Number.parseFloat(getComputedStyle(container).rowGap) || 0;
      const fullHeight =
        titleHeight + cardsHeight + rowGap * Math.max(0, rows.length - 1);

      setIsCompact(fullHeight > availableHeight);
      onReadyChange(true);
    };
    const scheduleMeasure = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => measure());
    };
    const handleResize = () => {
      // 모바일 주소창·키보드가 만드는 높이 변화에는 재배치하지 않는다.
      if (window.innerWidth === previousWidth && !desktop.matches) return;
      previousWidth = window.innerWidth;
      scheduleMeasure();
    };
    // 이미 마운트된 조작부는 페인트 전에 측정한다. 첫 선택 시 뒤쪽 형제의
    // ref만 기다리되, 다음 프레임까지 미뤄 카드가 뒤늦게 움직이지 않게 한다.
    if (controlsRef.current) measure();
    else
      queueMicrotask(() => {
        if (active) measure();
      });
    window.addEventListener("resize", handleResize);

    return () => {
      active = false;
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", handleResize);
    };
  }, [hasSelection, controlsRef, onReadyChange]);

  return (
    <div
      ref={containerRef}
      data-compact={hasSelection && isCompact}
      className="group/sections flex w-full flex-col gap-5"
    >
      {children}
    </div>
  );
}

export default InvestAssetSectionLayout;
