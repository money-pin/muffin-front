import SortDropdown, {
  type SortOption,
} from "@/components/common/SortDropdown";
import ProfitHistorySectorCard from "@/pages/invest/stats/components/ProfitHistorySectorCard";
import type {
  ProfitHistorySector,
  ProfitHistorySortKey,
} from "@/pages/invest/stats/types";

const SORT_OPTIONS = [
  { value: "AMOUNT_DESC", label: "수익금 높은 순" },
  { value: "AMOUNT_ASC", label: "수익금 낮은 순" },
  { value: "RATE_DESC", label: "수익률 높은 순" },
  { value: "RATE_ASC", label: "수익률 낮은 순" },
] as const satisfies readonly SortOption<ProfitHistorySortKey>[];

interface ProfitHistorySectorSectionProps {
  sectors: ProfitHistorySector[];
  sortKey: ProfitHistorySortKey;
  onSortChange: (value: ProfitHistorySortKey) => void;
}

export default function ProfitHistorySectorSection({
  sectors,
  sortKey,
  onSortChange,
}: ProfitHistorySectorSectionProps) {
  return (
    <section className="bg-neutral-0 flex flex-col gap-4 px-5 pt-5 pb-9">
      <div className="flex items-center justify-between">
        <h2 className="text-body-16-bd-tighter text-neutral-900">
          섹터별 상세 내역
        </h2>
        <SortDropdown
          options={SORT_OPTIONS}
          value={sortKey}
          onChange={onSortChange}
          ariaLabel="섹터별 상세 내역 정렬"
          align="end"
        />
      </div>

      <div className="flex flex-col gap-2">
        {sectors.map((sector) => (
          <ProfitHistorySectorCard key={sector.sectorCode} sector={sector} />
        ))}
      </div>
    </section>
  );
}
