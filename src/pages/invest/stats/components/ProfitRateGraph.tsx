import { useId, useLayoutEffect, useRef, useState } from "react";
import type { ProfitTrendPoint } from "@/pages/invest/stats/types";
import {
  createProfitRateGraphModel,
  formatProfitGraphRate,
  getProfitGraphLabelIndices,
} from "@/pages/invest/stats/utils/profitRateGraph";

interface ProfitRateGraphProps {
  data: ProfitTrendPoint[];
}

const DEFAULT_WIDTH = 291;
const HEIGHT = 200;
const MIN_PADDING_LEFT = 45;
const PADDING_RIGHT = 25;
const PADDING_TOP = 10;
const PADDING_BOTTOM = 30;
const CHART_HEIGHT = HEIGHT - PADDING_TOP - PADDING_BOTTOM;
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
  const titleId = useId();
  const descriptionId = useId();
  const model = createProfitRateGraphModel(data);
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
    const container = containerRef.current;
    if (!container) return;
    const labels = JSON.parse(labelKey) as { x: string[]; y: string[] };
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    let active = true;
    const measure = () => {
      if (!active) return;
      const width = container.getBoundingClientRect().width || DEFAULT_WIDTH;
      if (context)
        context.font = `500 ${AXIS_FONT_SIZE}px ${getComputedStyle(container).fontFamily}`;
      const textWidth = (label: string) =>
        context?.measureText(label).width ?? label.length * AXIS_FONT_SIZE;
      const paddingLeft = Math.max(
        MIN_PADDING_LEFT,
        Math.ceil(
          Math.max(...labels.y.map(textWidth)) +
            LABEL_AXIS_GAP +
            LABEL_EDGE_GAP,
        ),
      );
      const labelIndices = getProfitGraphLabelIndices(
        labels.x.map(textWidth),
        width - paddingLeft - PADDING_RIGHT,
      );
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

  const plotWidth = layout.width - layout.paddingLeft - PADDING_RIGHT;
  const getX = (index: number) =>
    layout.paddingLeft +
    (model.labels.length <= 1
      ? plotWidth / 2
      : (index / (model.labels.length - 1)) * plotWidth);
  const getY = (value: number) =>
    PADDING_TOP +
    CHART_HEIGHT -
    ((value - model.minY) / (model.maxY - model.minY)) * CHART_HEIGHT;
  const path = model.points
    .map(
      (point, index) =>
        `${index === 0 ? "M" : "L"} ${getX(index)} ${getY(point.value)}`,
    )
    .join(" ");

  return (
    <div
      ref={containerRef}
      className="flex h-[200px] w-full max-w-[291px] items-center justify-center"
    >
      <svg
        width={layout.width}
        height={HEIGHT}
        viewBox={`0 0 ${layout.width} ${HEIGHT}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-labelledby={`${titleId} ${descriptionId}`}
        className="h-full w-full select-none"
      >
        <title id={titleId}>최근 7일간 누적 수익률</title>
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
          x1={layout.paddingLeft}
          y1={PADDING_TOP}
          x2={layout.paddingLeft}
          y2={HEIGHT - PADDING_BOTTOM}
          stroke={AXIS_COLOR}
        />
        <line
          x1={layout.paddingLeft}
          y1={HEIGHT - PADDING_BOTTOM}
          x2={layout.width - PADDING_RIGHT}
          y2={HEIGHT - PADDING_BOTTOM}
          stroke={AXIS_COLOR}
        />
        {model.labels.map((label, index) => (
          <g key={`x-${label}-${index}`}>
            {index > 0 && (
              <line
                x1={getX(index)}
                y1={PADDING_TOP}
                x2={getX(index)}
                y2={HEIGHT - PADDING_BOTTOM}
                stroke={GRID_COLOR}
                strokeDasharray="4 4"
              />
            )}
            <line
              x1={getX(index)}
              y1={HEIGHT - PADDING_BOTTOM}
              x2={getX(index)}
              y2={HEIGHT - PADDING_BOTTOM + TICK_LENGTH}
              stroke={AXIS_COLOR}
            />
            {layout.labelIndices.includes(index) && (
              <text
                x={getX(index)}
                y={HEIGHT - 10}
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
              x1={layout.paddingLeft - TICK_LENGTH}
              y1={getY(value)}
              x2={layout.paddingLeft}
              y2={getY(value)}
              stroke={AXIS_COLOR}
            />
            {Math.abs(getY(value) - (HEIGHT - PADDING_BOTTOM)) > 0.5 && (
              <line
                x1={layout.paddingLeft}
                y1={getY(value)}
                x2={layout.width - PADDING_RIGHT}
                y2={getY(value)}
                stroke={GRID_COLOR}
                strokeDasharray="4 4"
              />
            )}
            <text
              x={layout.paddingLeft - LABEL_AXIS_GAP}
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
            r="5"
            fill={LINE_COLOR}
          />
        ))}
      </svg>
    </div>
  );
}
