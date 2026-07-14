import rankingPodiumIcon from "@/assets/icon-20px/ranking-podium.svg";
import RankingList from "@/pages/invest/ranking/components/RankingList";
import RankingPodium from "@/pages/invest/ranking/components/RankingPodium";
import RankingSectionHeader from "@/pages/invest/ranking/components/RankingSectionHeader";
import type { WeeklyRankingItem } from "@/pages/invest/ranking/types";

interface WeeklyRankingSectionProps {
  weekLabel: string;
  rankings: WeeklyRankingItem[];
}
export default function WeeklyRankingSection({
  weekLabel,
  rankings,
}: WeeklyRankingSectionProps) {
  return (
    <section className="flex w-full flex-col">
      <RankingSectionHeader
        iconSrc={rankingPodiumIcon}
        title="지난주 수익률 TOP 10"
        weekLabel={weekLabel}
      />
      <div className="flex w-full flex-col gap-1">
        <RankingPodium items={rankings} /> <RankingList items={rankings} />{" "}
      </div>
    </section>
  );
}
