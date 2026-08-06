import type { TopSector } from "@/pages/invest/stats/types";

import PercentageBadge from "./PercentageBadge";

// Figma RankBadge: 1위 금색(#ffd400)+진갈색 텍스트 / 2위 은색(#bababa) / 3위 동색(#de7813)
const RANK_STYLE: Record<TopSector["rank"], string> = {
  1: "bg-[#ffd400] text-[#331900]",
  2: "bg-[#bababa] text-white",
  3: "bg-[#de7813] text-white",
};

interface TopSectorListProps {
  sectors: TopSector[];
}

// Figma Top 3 Container: 카드 안에 랭크 배지 + 섹터명 + 수익액·수익률 3행
export default function TopSectorList({ sectors }: TopSectorListProps) {
  if (sectors.length === 0) {
    return (
      <div className="text-body-14-md flex w-full items-center justify-center rounded-[16px] border border-neutral-100 bg-white px-5 py-8 text-neutral-400">
        아직 표시할 섹터가 없어요.
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col rounded-[16px] border border-neutral-100 bg-white px-5 py-2">
      {sectors.map((sector) => {
        const up = sector.profitAmount >= 0;
        return (
          <div
            key={sector.rank}
            className="flex w-full items-center justify-between py-3"
          >
            <div className="flex items-center gap-3">
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-[8px] text-[16px] leading-none font-bold ${RANK_STYLE[sector.rank]}`}
              >
                {sector.rank}
              </span>
              <span className="text-body-16-md-tighter text-neutral-900">
                {sector.name}
              </span>
            </div>
            <div
              className={`flex items-center gap-2 ${
                up ? "text-positive" : "text-negative"
              }`}
            >
              <span className="text-body-16-bd-tighter">
                {up ? "+" : "-"}
                {Math.abs(sector.profitAmount).toLocaleString()}원
              </span>
              <PercentageBadge rate={sector.profitRate} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
