import type { ProfitTrendPoint } from "@/pages/invest/stats/types";

interface ProfitRateGraphProps {
  data: ProfitTrendPoint[];
}

function EmptyGraph() {
  return (
    <div className="flex h-[200px] w-full max-w-[291px] items-center justify-center rounded-lg bg-neutral-50 text-caption-12-md text-neutral-400">
      표시할 수익률 데이터가 부족합니다.
    </div>
  );
}

export default function ProfitRateGraph({ data }: ProfitRateGraphProps) {
  const width = 291;
  const height = 200;
  const paddingLeft = 45;
  const paddingRight = 25;
  const paddingTop = 10;
  const paddingBottom = 30;
  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;
  const maxY = 60000;
  const yGridValues = [60000, 45000, 30000, 15000, 0];
  const canDrawGraph = data.length >= 2;
  const gridColor = "#E2E2E2";
  const labelColor = "#999999";
  const lineColor = "#6F6F6F";
  const axisFontSize = 12;
  const gridDash = "4 4";
  const axisColor = "#999999";
  const tickLength = 6;

  if (!canDrawGraph) return <EmptyGraph />;

  const getX = (index: number) =>
    paddingLeft + (index / (data.length - 1)) * chartWidth;

  const getY = (value: number) =>
    paddingTop + chartHeight - (value / maxY) * chartHeight;

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
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="select-none"
      >
        <line
          x1={paddingLeft}
          y1={paddingTop}
          x2={paddingLeft}
          y2={height - paddingBottom - 8}
          stroke={axisColor}
          strokeWidth="1"
        />

        {data.map((point, index) => {
          const x = getX(index);

          return (
            <line
              key={`x-grid-${point.label}`}
              x1={x}
              y1={paddingTop}
              x2={x}
              y2={height - paddingBottom}
              stroke={gridColor}
              strokeWidth="1"
              strokeDasharray={gridDash}
            />
          );
        })}

        {yGridValues.map((value) => {
          const y = getY(value);
          const label = value === 0 ? "0k" : `${value / 1000}k`;

          return (
            <g key={value}>
              <line
                x1={paddingLeft - tickLength}
                y1={y}
                x2={paddingLeft}
                y2={y}
                stroke={axisColor}
                strokeWidth="1"
              />
              <line
                x1={paddingLeft}
                y1={y}
                x2={width - paddingRight}
                y2={y}
                stroke={gridColor}
                strokeWidth="1"
                strokeDasharray={gridDash}
              />
              <text
                x={paddingLeft - 10}
                y={y + 5}
                fill={labelColor}
                fontSize={axisFontSize}
                fontWeight="500"
                textAnchor="end"
              >
                {label}
              </text>
            </g>
          );
        })}

        <path
          d={pathD}
          stroke={lineColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {data.map((point, index) => (
          <circle
            key={`halo-${point.label}`}
            cx={getX(index)}
            cy={getY(point.value)}
            r="7"
            fill="white"
          />
        ))}

        {data.map((point, index) => (
          <circle
            key={point.label}
            cx={getX(index)}
            cy={getY(point.value)}
            r="5"
            fill={lineColor}
          />
        ))}

        {data.map((point, index) => (
          <text
            key={point.label}
            x={getX(index)}
            y={height - 10}
            fill={labelColor}
            fontSize={axisFontSize}
            fontWeight="500"
            textAnchor="middle"
          >
            {point.label}
          </text>
        ))}
      </svg>
    </div>
  );
}
