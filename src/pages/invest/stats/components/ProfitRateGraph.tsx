import { useId, useLayoutEffect, useRef, useState } from "react";
import type { ProfitTrendPoint } from "@/pages/invest/stats/types";
import {
  createProfitRateGraphModel,
  formatProfitGraphRate,
  getProfitGraphLabelIndices,
  getProfitGraphPlotSize,
  getProfitGraphHeight,
} from "@/pages/invest/stats/utils/profitRateGraph";

interface ProfitRateGraphProps {
  data: ProfitTrendPoint[];
}

const DEFAULT_WIDTH = 291;
const MIN_PADDING_LEFT = 45;
const PADDING_RIGHT = 25;
const PADDING_TOP = 10;
const PADDING_BOTTOM = 30;
const AXIS_FONT_SIZE = 12;
const LABEL_AXIS_GAP = 10;
const LABEL_EDGE_GAP = 4;
const TICK_LENGTH = 6;
const GRID_COLOR = "var(--color-neutral-100)";
const LABEL_COLOR = "var(--color-neutral-400)";
const LINE_COLOR = "var(--color-primary)";
const AXIS_COLOR = "var(--color-neutral-400)";

export default function ProfitRateGraph({ data }: ProfitRateGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [tooltipWidth, setTooltipWidth] = useState(80);
  const descriptionId = useId();
  const model = createProfitRateGraphModel(data);
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  const selectedIndex = model.points.findIndex(
    (point) => point.label === selectedLabel,
  );
  const selectedPoint = model.points[selectedIndex];
  // 같은 눈금·날짜면 데이터 재조회 때마다 글자 폭을 다시 측정하지 않는다.
  const labelKey = JSON.stringify({
    x: model.labels,
    y: model.ticks.map(formatProfitGraphRate),
  });
  const [layout, setLayout] = useState({
    width: DEFAULT_WIDTH,
    paddingLeft: MIN_PADDING_LEFT,
    labelIndices: model.labels.map((_, index) => index),
  });

  useLayoutEffect(() => {
    const tooltip = tooltipRef.current;
    if (tooltip) setTooltipWidth(tooltip.getBoundingClientRect().width);
  }, [selectedLabel, selectedPoint?.value, layout.width]);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const labels = JSON.parse(labelKey) as { x: string[]; y: string[] };
    const svg = container.querySelector("svg");
    if (!svg) return;
    let active = true;
    const measure = () => {
      if (!active) return;
      const width = container.getBoundingClientRect().width || DEFAULT_WIDTH;
      // 라벨과 같은 SVG·폰트로 측정해 부호와 첫 자리까지 여백에 포함한다.
      const text = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text",
      );
      text.setAttribute("font-size", String(AXIS_FONT_SIZE));
      text.setAttribute("font-weight", "500");
      text.setAttribute("visibility", "hidden");
      text.setAttribute("aria-hidden", "true");
      svg.appendChild(text);
      let paddingLeft: number;
      let labelIndices: number[];
      try {
        const textWidth = (label: string) => {
          text.textContent = label;
          const bounds = text.getBBox();
          return Math.max(text.getComputedTextLength(), bounds.width);
        };
        paddingLeft = Math.max(
          MIN_PADDING_LEFT,
          Math.ceil(
            Math.max(...labels.y.map(textWidth)) +
              LABEL_AXIS_GAP +
              LABEL_EDGE_GAP,
          ),
        );
        labelIndices = getProfitGraphLabelIndices(
          labels.x.map(textWidth),
          getProfitGraphPlotSize(
            width - paddingLeft - PADDING_RIGHT,
            labels.x.length,
            labels.y.length,
            getProfitGraphHeight(width),
          ).width,
        );
      } finally {
        text.remove();
      }
      setLayout((previous) =>
        previous.width === width &&
        previous.paddingLeft === paddingLeft &&
        previous.labelIndices.join() === labelIndices.join()
          ? previous
          : { width, paddingLeft, labelIndices },
      );
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(container);
    void document.fonts.ready.then(measure);
    document.fonts.addEventListener("loadingdone", measure);
    return () => {
      active = false;
      observer.disconnect();
      document.fonts.removeEventListener("loadingdone", measure);
    };
  }, [labelKey]);

  const availableWidth = layout.width - layout.paddingLeft - PADDING_RIGHT;
  const height = getProfitGraphHeight(layout.width);
  const { width: plotWidth, height: chartHeight } = getProfitGraphPlotSize(
    availableWidth,
    model.labels.length,
    model.ticks.length,
    height,
  );
  const plotLeft = layout.paddingLeft + (availableWidth - plotWidth) / 2;
  const plotTop =
    PADDING_TOP + (height - PADDING_TOP - PADDING_BOTTOM - chartHeight) / 2;
  const plotBottom = plotTop + chartHeight;
  const getX = (index: number) =>
    plotLeft +
    (model.labels.length <= 1
      ? plotWidth / 2
      : (index / (model.labels.length - 1)) * plotWidth);
  const getY = (value: number) =>
    plotTop +
    chartHeight -
    ((value - model.minY) / (model.maxY - model.minY)) * chartHeight;
  const path = model.points
    .map(
      (point, index) =>
        `${index === 0 ? "M" : "L"} ${getX(index)} ${getY(point.value)}`,
    )
    .join(" ");

  const selectPointAt = (clientX: number, bounds: DOMRect) => {
    if (!model.points.length) return;
    const x = ((clientX - bounds.left) / bounds.width) * layout.width;
    const index =
      model.points.length === 1
        ? 0
        : Math.round(((x - plotLeft) / plotWidth) * (model.points.length - 1));
    setSelectedLabel(
      model.points[Math.max(0, Math.min(model.points.length - 1, index))].label,
    );
  };

  const tooltipLeft = selectedPoint
    ? Math.max(
        tooltipWidth / 2 + 4,
        Math.min(layout.width - tooltipWidth / 2 - 4, getX(selectedIndex)),
      )
    : 0;

  return (
    <div
      ref={containerRef}
      className="relative flex w-full max-w-[320px] min-w-0 items-center justify-center"
      style={{ height }}
    >
      <svg
        width={layout.width}
        height={height}
        viewBox={`0 0 ${layout.width} ${height}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="최근 7일간 누적 수익률"
        className="h-full w-full select-none"
        tabIndex={model.points.length ? 0 : undefined}
        aria-describedby={
          selectedPoint
            ? `${descriptionId} ${descriptionId}-selection`
            : descriptionId
        }
        onPointerMove={(event) => {
          if (event.pointerType === "mouse")
            selectPointAt(
              event.clientX,
              event.currentTarget.getBoundingClientRect(),
            );
        }}
        onPointerDown={(event) => {
          selectPointAt(
            event.clientX,
            event.currentTarget.getBoundingClientRect(),
          );
        }}
        onPointerLeave={(event) => {
          if (event.pointerType === "mouse") setSelectedLabel(null);
        }}
        onFocus={() =>
          setSelectedLabel(
            (previous) => previous ?? model.points[0]?.label ?? null,
          )
        }
        onBlur={() => setSelectedLabel(null)}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            setSelectedLabel(null);
            return;
          }
          if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key))
            return;
          event.preventDefault();
          const index =
            event.key === "Home"
              ? 0
              : event.key === "End"
                ? model.points.length - 1
                : Math.max(
                    0,
                    Math.min(
                      model.points.length - 1,
                      Math.max(0, selectedIndex) +
                        (event.key === "ArrowRight" ? 1 : -1),
                    ),
                  );
          setSelectedLabel(model.points[index]?.label ?? null);
        }}
      >
        <desc id={descriptionId}>
          {model.points.length
            ? model.points
                .map(
                  (point, index) =>
                    `${model.labels[index]} ${formatProfitGraphRate(point.value)}`,
                )
                .join(", ")
            : "표시할 수익률 데이터가 없습니다."}
        </desc>
        <line
          x1={plotLeft}
          y1={plotTop}
          x2={plotLeft}
          y2={plotBottom}
          stroke={AXIS_COLOR}
        />
        <line
          x1={plotLeft}
          y1={plotBottom}
          x2={plotLeft + plotWidth}
          y2={plotBottom}
          stroke={AXIS_COLOR}
        />
        {model.labels.map((label, index) => (
          <g key={`x-${label}-${index}`}>
            {index > 0 && (
              <line
                x1={getX(index)}
                y1={plotTop}
                x2={getX(index)}
                y2={plotBottom}
                stroke={GRID_COLOR}
                strokeDasharray="4 4"
              />
            )}
            <line
              x1={getX(index)}
              y1={plotBottom}
              x2={getX(index)}
              y2={plotBottom + TICK_LENGTH}
              stroke={AXIS_COLOR}
            />
            {layout.labelIndices.includes(index) && (
              <text
                x={getX(index)}
                y={plotBottom + 20}
                fill={LABEL_COLOR}
                fontSize={AXIS_FONT_SIZE}
                fontWeight="500"
                textAnchor="middle"
              >
                {label}
              </text>
            )}
          </g>
        ))}
        {model.ticks.map((value) => (
          <g key={value}>
            <line
              x1={plotLeft - TICK_LENGTH}
              y1={getY(value)}
              x2={plotLeft}
              y2={getY(value)}
              stroke={AXIS_COLOR}
            />
            {(value === 0 || Math.abs(getY(value) - plotBottom) > 0.5) && (
              <line
                x1={plotLeft}
                y1={getY(value)}
                x2={plotLeft + plotWidth}
                y2={getY(value)}
                stroke={
                  value === 0 && model.points.length ? AXIS_COLOR : GRID_COLOR
                }
                strokeWidth={value === 0 && model.points.length ? 1.5 : 1}
                strokeDasharray={
                  value === 0 && model.points.length ? undefined : "4 4"
                }
                data-zero-baseline={
                  value === 0 && model.points.length ? true : undefined
                }
              />
            )}
            <text
              x={plotLeft - LABEL_AXIS_GAP}
              y={getY(value) + 5}
              fill={LABEL_COLOR}
              fontSize={AXIS_FONT_SIZE}
              fontWeight="500"
              textAnchor="end"
            >
              {formatProfitGraphRate(value)}
            </text>
          </g>
        ))}
        {model.points.length >= 2 && (
          <path
            d={path}
            stroke={LINE_COLOR}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
        {model.points.map((point, index) => (
          <circle
            key={`${point.label}-${index}`}
            cx={getX(index)}
            cy={getY(point.value)}
            r={index === selectedIndex ? 6 : 5}
            fill={LINE_COLOR}
          />
        ))}
      </svg>
      {!model.points.length && (
        <p className="text-caption-12-md bg-neutral-0 pointer-events-none absolute top-1/2 left-1/2 w-max max-w-full -translate-x-1/2 -translate-y-1/2 px-2 text-center text-neutral-400">
          표시할 수익률 데이터가 없습니다.
        </p>
      )}
      {selectedPoint && (
        <div
          ref={tooltipRef}
          id={`${descriptionId}-selection`}
          role="status"
          className="text-body-14-md bg-neutral-0 border-primary-200 pointer-events-none absolute -translate-x-1/2 -translate-y-full rounded-full border px-3 py-1 whitespace-nowrap text-neutral-700 shadow-sm"
          style={{
            left: tooltipLeft,
            top: getY(selectedPoint.value) - 14,
          }}
        >
          <span
            aria-hidden="true"
            className="bg-neutral-0 border-primary-200 absolute -bottom-1 size-2 -translate-x-1/2 rotate-45 border-r border-b"
            style={{
              left: Math.max(
                12,
                Math.min(
                  tooltipWidth - 12,
                  getX(selectedIndex) - tooltipLeft + tooltipWidth / 2,
                ),
              ),
            }}
          />
          <span className="sr-only">{selectedPoint.label} </span>
          <span className="relative tabular-nums">{selectedPoint.value}%</span>
        </div>
      )}
    </div>
  );
}
