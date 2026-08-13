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
const GRID_STEP_COUNT = 4;
const OVERLAP_THRESHOLD = 0.5;
const EMPTY_AXIS_RANGE = { minY: 0, maxY: 10 };
const RECENT_DAY_COUNT = 7;
const MS_PER_DAY = 86_400_000;
const AXIS_PADDING_RATIO = 0.15;
const MIN_AXIS_PADDING = 0.1;
const SMALL_VALUE_THRESHOLD = 1;
const SMALL_VALUE_AXIS_RANGE = { minY: -2, maxY: 2 };

function roundDownByStep(value: number, step: number) {
  return Math.floor(value / step) * step;
}

function roundUpByStep(value: number, step: number) {
  return Math.ceil(value / step) * step;
}

function getNiceStep(value: number) {
  if (value <= 0) return 1;

  const magnitude = 10 ** Math.floor(Math.log10(value));
  const normalized = value / magnitude;
  const niceNormalized =
    normalized <= 1
      ? 1
      : normalized <= 2
        ? 2
        : normalized <= 2.5
          ? 2.5
          : normalized <= 5
            ? 5
            : 10;

  return niceNormalized * magnitude;
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

  if (minValue >= -SMALL_VALUE_THRESHOLD && maxValue <= SMALL_VALUE_THRESHOLD) {
    return SMALL_VALUE_AXIS_RANGE;
  }

  const rawRange = maxValue - minValue;
  const padding = Math.max(rawRange * AXIS_PADDING_RATIO, MIN_AXIS_PADDING);
  const paddedMin = minValue < 0 ? minValue - padding : 0;
  const paddedMax = maxValue > 0 ? maxValue + padding : 0;
  const step = getNiceStep((paddedMax - paddedMin) / GRID_STEP_COUNT);
  const minY = roundDownByStep(paddedMin, step);
  const maxY = roundUpByStep(paddedMax, step);

  if (minY === maxY) {
    return { minY: minY - padding, maxY: maxY + padding };
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
  return `${Number(value.toFixed(2))}%`;
}

function formatXAxisLabel(value: string) {
  const [, , month, day] =
    /^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})$/.exec(value) ?? [];

  return month && day ? `${Number(month)}/${Number(day)}` : value;
}

function getDateParts(value: string, now = new Date()) {
  const [, fullYear, fullMonth, fullDay] =
    /^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})$/.exec(value) ?? [];

  if (fullYear && fullMonth && fullDay) {
    return {
      year: Number(fullYear),
      month: Number(fullMonth),
      day: Number(fullDay),
    };
  }

  const [, shortMonth, shortDay] = /^(\d{1,2})\/(\d{1,2})$/.exec(value) ?? [];
  if (!shortMonth || !shortDay) return null;

  const currentYear = Number(
    new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Seoul",
      year: "numeric",
    }).format(now),
  );

  return {
    year: currentYear,
    month: Number(shortMonth),
    day: Number(shortDay),
  };
}

function getForwardDateLabels(startDate: string) {
  const dateParts = getDateParts(startDate);
  if (!dateParts) return null;

  const startTime = Date.UTC(
    dateParts.year,
    dateParts.month - 1,
    dateParts.day,
  );

  return Array.from({ length: RECENT_DAY_COUNT }, (_, index) => {
    const date = new Date(startTime + index * MS_PER_DAY);

    return `${date.getUTCMonth() + 1}/${date.getUTCDate()}`;
  });
}

function getForwardDateLabelsFromToday(now = new Date()) {
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
    const date = new Date(currentDate + index * MS_PER_DAY);

    return `${date.getUTCMonth() + 1}/${date.getUTCDate()}`;
  });
}

export default function ProfitRateGraph({
  data,
  isEmpty = false,
}: ProfitRateGraphProps) {
  const firstNonZeroIndex = data.findIndex((point) => point.value !== 0);
  const hasProfitData = !isEmpty && firstNonZeroIndex >= 0;
  const chartData = hasProfitData ? data.slice(firstNonZeroIndex) : [];
  const forwardLabels =
    firstNonZeroIndex > 0 && chartData.length > 0
      ? getForwardDateLabels(chartData[0].label)
      : null;
  const labels = !hasProfitData
    ? getForwardDateLabelsFromToday()
    : (forwardLabels ?? data.map((point) => formatXAxisLabel(point.label)));
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
