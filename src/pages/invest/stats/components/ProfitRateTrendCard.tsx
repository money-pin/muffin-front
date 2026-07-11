import chartIcon from "@/assets/icon-20px/stats-graph.svg";
import type { ProfitTrendPoint } from "@/pages/invest/stats/types";

import ProfitRateGraph from "./ProfitRateGraph";

interface ProfitRateTrendCardProps {
  data: ProfitTrendPoint[];
}

export default function ProfitRateTrendCard({
  data,
}: ProfitRateTrendCardProps) {
  return (
    <div className="flex w-full flex-col items-center gap-4 rounded-2xl border border-neutral-100 bg-neutral-0 p-5">
      <div className="flex w-full items-center gap-1 px-1">
        <img
          src={chartIcon}
          alt=""
          aria-hidden="true"
          className="h-5 w-5 object-contain"
          draggable={false}
        />
        <h2 className="text-body-16-bd-tighter leading-[1.6] text-neutral-900">
          수익률 추이
        </h2>
      </div>

      <ProfitRateGraph data={data} />

      <p className="text-caption-12-md text-neutral-400">
        최근 7일간의 수익률 변화
      </p>
    </div>
  );
}
