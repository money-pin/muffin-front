import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Carousel from "@/components/common/Carousel";
import TabBar from "@/components/common/TabBar";
import Badge from "@/components/common/Badge";
import NewsCard, { type NewsCardProps } from "./components/NewsCard";
import ScrollToTopButton from "./components/ScrollToTopButton";

import megaphoneIcon from "@/assets/icon-20px/megaphone.svg";
import newscardEconomy from "@/assets/newscard/newscard-economy.png";
import newscardIT from "@/assets/newscard/newscard-IT.png";
import newscardWorld from "@/assets/newscard/newscard-world.png";

const CAROUSEL_IMAGES = {
  economy: newscardEconomy,
  IT: newscardIT,
  world: newscardWorld,
} as const;

export default function NewsPage() {
  const navigate = useNavigate();
  type NewsTabType = "all" | "economy" | "stock" | "world";
  const [currentTab, setCurrentTab] = useState<NewsTabType>("all");

  const trendingNewsList = [
    {
      id: 1,
      imageType: "economy" as const,
      category: "경제",
      title: "엔비디아 실적 발표 대기, 국내 반도체 자산 시장에 미칠 영향은?",
    },
    {
      id: 2,
      imageType: "IT" as const,
      category: "IT",
      title: "AI 반도체 수요 폭증, 삼성전자 HBM 증설 나선다",
    },
    {
      id: 3,
      imageType: "world" as const,
      category: "세계",
      title: "美 연준 금리 동결, 신흥국 증시 안도 랠리",
    },
  ];

  const todayNewsList: NewsCardProps[] = [
    {
      id: 1,
      title: "코인 시장 변동성 확대",
      category: "경제",
      date: "오늘",
      views: "6천회",
      imageType: "economy",
    },
    {
      id: 2,
      title: "에너지 섹터 투자 포인트",
      category: "증권",
      date: "1일 전",
      views: "6천회",
      imageType: "IT",
    },
    {
      id: 3,
      title: "미국 기준금리 동결, 증시 안도 랠리",
      category: "세계",
      date: "3일 전",
      views: "6천회",
      imageType: "world",
    },
    {
      id: 4,
      title: "국내 증시 외국인 순매수세",
      category: "경제",
      date: "2026-04-21",
      views: "56만회",
      imageType: "economy",
    },
  ];

  const newsTabs = [
    { value: "all", label: "전체" },
    { value: "economy", label: "경제" },
    { value: "stock", label: "증권" },
    { value: "world", label: "세계" },
  ] as const;

  const tabCategoryMap: Record<Exclude<NewsTabType, "all">, string> = {
    economy: "경제",
    stock: "증권",
    world: "세계",
  };

  const filteredNewsList = todayNewsList.filter((news) => {
    if (currentTab === "all") return true;
    return news.category === tabCategoryMap[currentTab];
  });

  return (
    <div className="relative flex min-h-dvh w-full flex-col bg-[#F5F5F5] pt-5 text-black">
      <section className="flex w-full flex-col gap-3">
        <div className="flex h-[26px] items-center gap-[4px] px-5">
          <img
            src={megaphoneIcon}
            alt=""
            aria-hidden="true"
            className="h-[20px] w-[20px] object-contain"
            draggable={false}
          />
          <h2 className="text-[16px] font-bold leading-[160%] text-[#1B1B1B]">
            따끈한 금융 소식
          </h2>
        </div>

        <Carousel>
          {trendingNewsList.map((news) => (
            <div
              key={news.id}
              onClick={() => navigate(`/news/${news.id}`)}
              className="flex cursor-pointer flex-col gap-4 rounded-[20px] border border-neutral-100 bg-white p-5 shadow-sm"
            >
              <div className="h-[201px] w-full overflow-hidden rounded-[12px]">
                <img
                  src={CAROUSEL_IMAGES[news.imageType]}
                  alt=""
                  aria-hidden="true"
                  className="h-full w-full object-cover"
                  draggable={false}
                />
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-[6px]">
                  <Badge>{news.category}</Badge>
                  <span className="text-xs text-neutral-400">2시간 전</span>
                </div>
                <h3 className="line-clamp-2 text-base font-bold leading-snug text-[#1B1B1B]">
                  {news.title}
                </h3>
              </div>
            </div>
          ))}
        </Carousel>
      </section>

      <div className="sticky top-0 z-10 mt-8 w-full bg-[#F5F5F5]">
        <TabBar
          tabs={newsTabs}
          currentTab={currentTab}
          onTabChange={(value) => setCurrentTab(value as NewsTabType)}
        />
      </div>

      <section className="mt-6 flex flex-col gap-[12px] px-5 pb-24">
        <h2 className="text-lg font-bold text-neutral-950">오늘의 뉴스</h2>

        <div className="flex flex-col gap-[12px]">
          {filteredNewsList.map((news) => (
            <NewsCard key={news.id} {...news} />
          ))}
        </div>
      </section>

      <ScrollToTopButton />
    </div>
  );
}
