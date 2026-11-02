import { Link } from "react-router-dom";

import type { BriefingIssue } from "@/lib/briefingApi";

interface BriefingIssueCardProps {
  issue: BriefingIssue;
}

// 브리핑 이슈 카드 (Figma 런칭 전 수정 > 브리핑)
// 제목 · 요약 · "그래서 나한테는?" · 관련 섹터 칩 · [뉴스보기]
export default function BriefingIssueCard({ issue }: BriefingIssueCardProps) {
  const canOpenArticle = issue.articleAvailable && issue.newsId != null;

  return (
    <article className="bg-neutral-0 flex w-full flex-col items-end gap-1 rounded-[12px] border border-neutral-100 px-4 py-5">
      <div className="flex w-full flex-col gap-4">
        <h2 className="text-body-16-md flex w-full gap-1 tracking-[-0.4px] text-neutral-900">
          <span className="shrink-0">
            {String(issue.order).padStart(2, "0")}.
          </span>
          <span className="min-w-0 flex-1 break-keep">{issue.title}</span>
        </h2>

        <p className="text-body-16-rg-tighter px-1 py-1 leading-[1.5] break-keep text-neutral-700">
          {issue.summary}
        </p>

        <div className="flex w-full flex-col gap-3">
          {issue.impactLine && (
            <div className="bg-secondary-50 flex flex-col rounded-[12px] py-3.5 pr-4 pl-5">
              <p className="text-caption-12-bd leading-[1.3] text-[var(--color-invest-deposit)]">
                그래서 나한테는?
              </p>
              <p className="text-caption-12-md break-keep text-neutral-600">
                {issue.impactLine}
              </p>
            </div>
          )}

          {issue.sectors.length > 0 && (
            <ul className="flex flex-wrap items-center gap-2">
              {issue.sectors.map((sector) => (
                <li
                  key={sector.sectorCode}
                  className="text-caption-12-md-tighter flex h-[22px] min-w-[26px] items-center justify-center rounded-[4px] bg-neutral-50 px-2 text-neutral-700"
                >
                  {sector.sectorName}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {canOpenArticle && (
        <Link
          to={`/news/${issue.newsId}`}
          className="text-caption-12-md text-primary underline"
        >
          뉴스보기
        </Link>
      )}
    </article>
  );
}
