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
  const paddingTop = 15;
  const paddingBottom = 25;
  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;
  const maxY = 60000;
  const yGridValues = [60000, 45000, 30000, 15000, 0];
  const canDrawGraph = data.length >= 2;

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
        {yGridValues.map((value) => {
          const y = getY(value);
          const label = value === 0 ? "0k" : `${value / 1000}k`;

          return (
            <g key={value}>
              <line
                x1={paddingLeft}
                y1={y}
                x2={width - paddingRight}
                y2={y}
                stroke="#E2E2E2"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
              <text
                x={paddingLeft - 8}
                y={y + 4}
                fill="#999999"
                fontSize="11"
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
          stroke="#6F6F6F"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {data.map((point, index) => (
          <circle
            key={point.label}
            cx={getX(index)}
            cy={getY(point.value)}
            r="4"
            fill="#535353"
            stroke="#FFFFFF"
            strokeWidth="1.5"
          />
        ))}

        {data.map((point, index) => (
          <text
            key={point.label}
            x={getX(index)}
            y={height - 6}
            fill="#999999"
            fontSize="11"
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
