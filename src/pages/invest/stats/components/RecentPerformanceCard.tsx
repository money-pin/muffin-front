import calendarIcon from "@/assets/icon-20px/calendar.svg";
import chevronRightIcon from "@/assets/icon-24px/chevron-right-thin.svg";
import Badge from "@/components/common/Badge";
import type { InvestmentResultDate } from "@/pages/invest/stats/types";

interface RecentPerformanceCardProps {
  date: InvestmentResultDate;
}

export default function RecentPerformanceCard({
  date,
}: RecentPerformanceCardProps) {
  return (
    <div className="flex w-full items-center justify-between rounded-2xl border border-neutral-100 bg-neutral-0 py-5 pl-5 pr-4">
      <div className="flex items-center gap-1">
        <img
          src={calendarIcon}
          alt=""
          aria-hidden="true"
          className="h-5 w-5 object-contain"
          draggable={false}
        />
        <h2 className="text-body-16-bd-tighter leading-[1.6] text-neutral-900">
          최근 투자 성과
        </h2>
      </div>

      <div className="flex items-center gap-1">
        <Badge variant="gray" size="sm">
          {date.month}월 {date.day}일
        </Badge>
        <img
          src={chevronRightIcon}
          alt=""
          aria-hidden="true"
          className="h-6 w-6 object-contain"
          draggable={false}
        />
      </div>
    </div>
  );
}
