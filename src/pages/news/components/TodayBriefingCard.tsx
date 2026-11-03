import { Link } from "react-router-dom";

import type { BriefingResponse } from "@/lib/briefingApi";

interface TodayBriefingCardProps {
  briefing: BriefingResponse;
}

// 뉴스 탭 상단 "오늘의 브리핑" 카드 (Figma 런칭 전 수정 > 뉴스)
// 오늘의 한 줄 + 이슈 3개. 누르면 브리핑 화면으로 이동한다.
// 이슈 칩은 브리핑 응답에 카테고리가 없어 첫 번째 관련 섹터 이름을 쓴다.
export default function TodayBriefingCard({
  briefing,
}: TodayBriefingCardProps) {
  return (
    <Link
      to="/briefing"
      className="bg-neutral-0 flex w-full flex-col gap-4 rounded-[16px] border border-neutral-100 p-5"
    >
      <p className="text-body-16-md-tighter line-clamp-2 leading-[1.35] break-keep text-neutral-900">
        {briefing.headline}
      </p>
      <ul className="flex flex-col gap-3">
        {briefing.issues.map((issue) => {
          const chip = issue.sectors[0]?.sectorName;
          return (
            <li key={issue.order} className="flex items-center gap-1">
              {chip && (
                <span className="bg-secondary-100 text-caption-12-md-tighter text-primary flex h-[22px] min-w-[45px] shrink-0 items-center justify-center rounded-[4px] px-1.5">
                  {chip}
                </span>
              )}
              <span className="text-body-14-rg min-w-0 flex-1 truncate text-neutral-700">
                {issue.title}
              </span>
            </li>
          );
        })}
      </ul>
    </Link>
  );
}
