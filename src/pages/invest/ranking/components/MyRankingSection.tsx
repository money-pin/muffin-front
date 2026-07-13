import rankingTrophyIcon from "@/assets/icon-20px/ranking-trophy.svg";
import Badge from "@/components/common/Badge";
import RankingBadge from "@/pages/invest/ranking/components/RankingBadge";
import RankingSectionHeader from "@/pages/invest/ranking/components/RankingSectionHeader";
import type { MyRanking } from "@/pages/invest/ranking/types";

interface MyRankingSectionProps {
  weekLabel: string;
  ranking: MyRanking;
}

export default function MyRankingSection({
  weekLabel,
  ranking,
}: MyRankingSectionProps) {
  return (
    <section className="flex w-full flex-col gap-3">
      <RankingSectionHeader
        iconSrc={rankingTrophyIcon}
        title="나의 순위"
        weekLabel={weekLabel}
      />

      <div className="px-5">
        {ranking.participated ? (
          <div className="flex h-[58px] items-center gap-3 rounded-xl border border-neutral-100 bg-neutral-0 p-3">
            <RankingBadge rank={ranking.rank} showSuffix />

            <span className="min-w-0 flex-1 truncate text-body-16-md-tighter text-neutral-900">
              {ranking.nickname}
            </span>

            <Badge variant="orange" size="category" className="shrink-0">
              상위 {ranking.percentile}%
            </Badge>
          </div>
        ) : (
          <div className="flex flex-col rounded-xl border border-neutral-100 bg-neutral-50 py-[14px] pl-5 pr-4">
            <p className="text-body-14-bd text-neutral-900">
              모의투자에 참여하지 않아 랭킹이 없어요.
            </p>
            <p className="text-caption-12-md text-neutral-600">
              이번 주 모의투자에 참여하고 랭킹에 도전해보세요!
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
