import rankingPodiumIcon from "@/assets/icon-20px/ranking-podium.svg";
import RankingList from "@/pages/invest/ranking/components/RankingList";
import RankingPodium from "@/pages/invest/ranking/components/RankingPodium";
import RankingSectionHeader from "@/pages/invest/ranking/components/RankingSectionHeader";
import type { WeeklyRankingItem } from "@/pages/invest/ranking/types";

interface WeeklyRankingSectionProps {
  weekLabel: string;
  rankings: WeeklyRankingItem[];
  onRankingClick?: (item: WeeklyRankingItem) => void;
  emptyMessage?: { title: string; description: string };
}
export default function WeeklyRankingSection({
  weekLabel,
  rankings,
  onRankingClick,
  emptyMessage,
}: WeeklyRankingSectionProps) {
  return (
    <section className={`flex w-full flex-col ${emptyMessage ? "flex-1" : ""}`}>
      <RankingSectionHeader
        iconSrc={rankingPodiumIcon}
        title="지난주 수익률 TOP 10"
        weekLabel={weekLabel}
      />
      {emptyMessage ? (
        <div
          role="status"
          className="flex min-h-[180px] flex-1 flex-col items-center justify-center gap-2 px-5 py-10 text-center break-keep"
        >
          <p className="text-body-14-bd text-neutral-900">
            {emptyMessage.title}
          </p>
          <p className="text-caption-12-md text-neutral-600">
            {emptyMessage.description}
          </p>
        </div>
      ) : (
        <div className="flex w-full flex-col gap-1">
          <RankingPodium items={rankings} onRankingClick={onRankingClick} />
          <RankingList items={rankings} onRankingClick={onRankingClick} />
        </div>
      )}
    </section>
  );
}
