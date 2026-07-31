import type { ProfitTrendPoint } from "@/pages/invest/stats/types";

interface ProfitRateGraphProps {
  data: ProfitTrendPoint[];
  isEmpty?: boolean;
}

const WIDTH = 291;
const HEIGHT = 200;
const PADDING_LEFT = 45;
const PADDING_RIGHT = 25;
const PADDING_TOP = 10;
const PADDING_BOTTOM = 30;
const CHART_WIDTH = WIDTH - PADDING_LEFT - PADDING_RIGHT;
const CHART_HEIGHT = HEIGHT - PADDING_TOP - PADDING_BOTTOM;
const GRID_COLOR = "var(--color-neutral-100)";
const LABEL_COLOR = "var(--color-neutral-400)";
const LINE_COLOR = "var(--color-primary)";
const AXIS_COLOR = "var(--color-neutral-400)";
const AXIS_FONT_SIZE = 12;
const GRID_DASH = "4 4";
const TICK_LENGTH = 6;
const MIN_AXIS_RANGE = 5;
const GRID_STEP_COUNT = 4;
const OVERLAP_THRESHOLD = 0.5;
const EMPTY_AXIS_RANGE = { minY: 0, maxY: 10 };
const RECENT_DAY_COUNT = 7;
const MS_PER_DAY = 86_400_000;

function roundDownByStep(value: number, step: number) {
  return Math.floor(value / step) * step;
}

function roundUpByStep(value: number, step: number) {
  return Math.ceil(value / step) * step;
}

function getAxisRange(data: ProfitTrendPoint[]) {
  if (data.length === 0) {
    return EMPTY_AXIS_RANGE;
  }

  const values = data.map((point) => point.value);
  const minValue = Math.min(...values, 0);
  const maxValue = Math.max(...values, 0);

  if (minValue === 0 && maxValue === 0) {
    return EMPTY_AXIS_RANGE;
  }

  const rawRange = Math.max(maxValue - minValue, MIN_AXIS_RANGE);
  const step = Math.max(1, Math.ceil(rawRange / GRID_STEP_COUNT));
  const minY = roundDownByStep(minValue, step);
  const maxY = roundUpByStep(maxValue, step);

  if (minY === maxY) {
    return { minY: minY - MIN_AXIS_RANGE, maxY: maxY + MIN_AXIS_RANGE };
  }

  return { minY, maxY };
}

function getGridValues(minY: number, maxY: number) {
  const step = (maxY - minY) / GRID_STEP_COUNT;

  return Array.from(
    { length: GRID_STEP_COUNT + 1 },
    (_, index) => maxY - step * index,
  );
}

function getLabel(value: number) {
  return `${Number.isInteger(value) ? value : value.toFixed(1)}%`;
}

function formatXAxisLabel(value: string) {
  const [, , month, day] =
    /^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})$/.exec(value) ?? [];

  return month && day ? `${Number(month)}/${Number(day)}` : value;
}

function getRecentDateLabels(now = new Date()) {
  const dateParts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).formatToParts(now);
  const year = Number(dateParts.find((part) => part.type === "year")?.value);
  const month = Number(dateParts.find((part) => part.type === "month")?.value);
  const day = Number(dateParts.find((part) => part.type === "day")?.value);
  const currentDate = Date.UTC(year, month - 1, day);

  return Array.from({ length: RECENT_DAY_COUNT }, (_, index) => {
    const offset = RECENT_DAY_COUNT - 1 - index;
    const date = new Date(currentDate - offset * MS_PER_DAY);

    return `${date.getUTCMonth() + 1}/${date.getUTCDate()}`;
  });
}

export default function ProfitRateGraph({
  data,
  isEmpty = false,
}: ProfitRateGraphProps) {
  const labels =
    data.length > 0
      ? data.map((point) => formatXAxisLabel(point.label))
      : getRecentDateLabels();
  const chartData = isEmpty ? [] : data;
  const { minY, maxY } = getAxisRange(chartData);
  const yGridValues = getGridValues(minY, maxY);
  const canDrawDot = chartData.length >= 1;
  const canDrawLine = chartData.length >= 2;

  const getX = (index: number) => {
    if (labels.length <= 1) {
      return PADDING_LEFT + CHART_WIDTH / 2;
    }

    return PADDING_LEFT + (index / (labels.length - 1)) * CHART_WIDTH;
  };

  const getY = (value: number) =>
    PADDING_TOP +
    CHART_HEIGHT -
    ((value - minY) / (maxY - minY)) * CHART_HEIGHT;

  const pathD = chartData
    .map((point, index) => {
      const x = getX(index);
      const y = getY(point.value);

      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");

  return (
    <div className="flex h-[200px] w-full max-w-[291px] items-center justify-center">
      <svg
        width={WIDTH}
        height={HEIGHT}
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full select-none"
      >
        <line
          x1={PADDING_LEFT}
          y1={PADDING_TOP}
          x2={PADDING_LEFT}
          y2={HEIGHT - PADDING_BOTTOM}
          stroke={AXIS_COLOR}
          strokeWidth="1"
        />
        <line
          x1={PADDING_LEFT}
          y1={HEIGHT - PADDING_BOTTOM}
          x2={WIDTH - PADDING_RIGHT}
          y2={HEIGHT - PADDING_BOTTOM}
          stroke={AXIS_COLOR}
          strokeWidth="1"
        />

        {labels.map((label, index) => {
          const x = getX(index);
          const isOverlappingYAxis =
            Math.abs(x - PADDING_LEFT) <= OVERLAP_THRESHOLD;

          return (
            <g key={`x-grid-${label}-${index}`}>
              {!isOverlappingYAxis && (
                <line
                  x1={x}
                  y1={PADDING_TOP}
                  x2={x}
                  y2={HEIGHT - PADDING_BOTTOM}
                  stroke={GRID_COLOR}
                  strokeWidth="1"
                  strokeDasharray={GRID_DASH}
                />
              )}
              <line
                x1={x}
                y1={HEIGHT - PADDING_BOTTOM}
                x2={x}
                y2={HEIGHT - PADDING_BOTTOM + TICK_LENGTH}
                stroke={AXIS_COLOR}
                strokeWidth="1"
              />
              <text
                x={x}
                y={HEIGHT - 10}
                fill={LABEL_COLOR}
                fontSize={AXIS_FONT_SIZE}
                fontWeight="500"
                textAnchor="middle"
              >
                {label}
              </text>
            </g>
          );
        })}

        {yGridValues.map((value) => {
          const y = getY(value);
          const isOverlappingXAxis =
            Math.abs(y - (HEIGHT - PADDING_BOTTOM)) <= OVERLAP_THRESHOLD;

          return (
            <g key={value}>
              <line
                x1={PADDING_LEFT - TICK_LENGTH}
                y1={y}
                x2={PADDING_LEFT}
                y2={y}
                stroke={AXIS_COLOR}
                strokeWidth="1"
              />
              {!isOverlappingXAxis && (
                <line
                  x1={PADDING_LEFT}
                  y1={y}
                  x2={WIDTH - PADDING_RIGHT}
                  y2={y}
                  stroke={GRID_COLOR}
                  strokeWidth="1"
                  strokeDasharray={GRID_DASH}
                />
              )}
              <text
                x={PADDING_LEFT - 10}
                y={y + 5}
                fill={LABEL_COLOR}
                fontSize={AXIS_FONT_SIZE}
                fontWeight="500"
                textAnchor="end"
              >
                {getLabel(value)}
              </text>
            </g>
          );
        })}

        {canDrawLine && (
          <path
            d={pathD}
            stroke={LINE_COLOR}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}

        {canDrawDot &&
          chartData.map((point, index) => (
            <circle
              key={`dot-${point.label}-${index}`}
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
