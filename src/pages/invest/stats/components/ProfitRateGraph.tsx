import type { ProfitTrendPoint } from "@/pages/invest/stats/types";

interface ProfitRateGraphProps {
  data: ProfitTrendPoint[];
}

const WIDTH = 291;
const HEIGHT = 200;
const PADDING_LEFT = 45;
const PADDING_RIGHT = 25;
const PADDING_TOP = 10;
const PADDING_BOTTOM = 30;
const CHART_WIDTH = WIDTH - PADDING_LEFT - PADDING_RIGHT;
const CHART_HEIGHT = HEIGHT - PADDING_TOP - PADDING_BOTTOM;
const EMPTY_LABELS = ["5/1", "5/2", "5/3", "5/4", "5/5", "5/6", "5/7"];
const GRID_COLOR = "var(--color-neutral-100)";
const LABEL_COLOR = "var(--color-neutral-400)";
const LINE_COLOR = "var(--color-primary)";
const AXIS_COLOR = "var(--color-neutral-400)";
const AXIS_FONT_SIZE = 12;
const GRID_DASH = "4 4";
const TICK_LENGTH = 6;
const MIN_AXIS_RANGE = 5;
const GRID_STEP_COUNT = 4;

// TODO: 그래프 UI는 추후 디자인 보정 시 차트 라이브러리 전환까지 함께 검토한다.

function roundDownByStep(value: number, step: number) {
  return Math.floor(value / step) * step;
}

function roundUpByStep(value: number, step: number) {
  return Math.ceil(value / step) * step;
}

function getAxisRange(data: ProfitTrendPoint[]) {
  if (data.length === 0) {
    return { minY: 0, maxY: 10 };
  }

  const values = data.map((point) => point.value);
  const minValue = Math.min(...values, 0);
  const maxValue = Math.max(...values, 0);
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

export default function ProfitRateGraph({ data }: ProfitRateGraphProps) {
  const labels =
    data.length > 0 ? data.map((point) => point.label) : EMPTY_LABELS;
  const { minY, maxY } = getAxisRange(data);
  const yGridValues = getGridValues(minY, maxY);
  const canDrawDot = data.length >= 1;
  const canDrawLine = data.length >= 2;

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

  const pathD = data
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

        {labels.map((label, index) => {
          const x = getX(index);

          return (
            <g key={`x-grid-${label}`}>
              <line
                x1={x}
                y1={PADDING_TOP}
                x2={x}
                y2={HEIGHT - PADDING_BOTTOM}
                stroke={GRID_COLOR}
                strokeWidth="1"
                strokeDasharray={GRID_DASH}
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
              <line
                x1={PADDING_LEFT}
                y1={y}
                x2={WIDTH - PADDING_RIGHT}
                y2={y}
                stroke={GRID_COLOR}
                strokeWidth="1"
                strokeDasharray={GRID_DASH}
              />
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
          data.map((point, index) => (
            <circle
              key={`dot-${point.label}`}
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
