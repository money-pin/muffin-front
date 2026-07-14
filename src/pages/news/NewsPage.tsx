import { useState } from "react";
import Carousel from "../../components/common/Carousel";
import TabBar from "../../components/common/TabBar";
import Badge from "../../components/common/Badge";
import NewCard from "./components/NewCard";
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
  type NewsTabType = "all" | "economy" | "stock" | "world";
  const [currentTab, setCurrentTab] = useState<NewsTabType>("all");

  const trendingNewsList = [
    { id: 1, imageType: "economy" as const, category: "경제", title: "엔비디아 실적 발표 대기, 국내 반도체 자산 시장에 미칠 영향은?" },
    { id: 2, imageType: "IT" as const, category: "IT", title: "AI 반도체 수요 폭증, 삼성전자 HBM 증설 나선다" },
    { id: 3, imageType: "world" as const, category: "세계", title: "美 연준 금리 동결, 신흥국 증시 안도 랠리" },
  ];

  const todayNewsList: React.ComponentProps<typeof NewCard>[] = [
    {
      title: "코인 시장 변동성 확대",
      category: "경제",
      date: "오늘",
      views: "6천회",
      imageType: "economy",
    },
    {
      title: "에너지 섹터 투자 포인트",
      category: "증권",
      date: "1일 전",
      views: "6천회",
      imageType: "IT",
    },
    {
      title: "미국 기준금리 동결, 증시 안도 랠리",
      category: "세계",
      date: "3일 전",
      views: "6천회",
      imageType: "world",
    },
    {
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
    <div className="w-full min-h-dvh bg-[#F5F5F5] flex flex-col text-black relative pt-5">
      <section className="w-full flex flex-col gap-3">
        <div className="px-5 flex items-center gap-[4px] h-[26px]">
          <img 
            src={megaphoneIcon} 
            alt="" 
            aria-hidden="true" 
            className="w-[20px] h-[20px] object-contain"
            draggable={false}
          />
          <h2 className="text-[16px] font-bold text-[#1B1B1B] leading-[160%]">
            따끈한 금융 소식
          </h2>
        </div>
        
        <Carousel>
          {trendingNewsList.map((news) => (
            <div 
              key={news.id} 
              className="p-5 bg-white border border-neutral-100 rounded-[20px] flex flex-col gap-4 shadow-sm"
            >
              <div className="w-full h-[201px] rounded-[12px] overflow-hidden">
                <img 
                  src={CAROUSEL_IMAGES[news.imageType]} 
                  alt="" 
                  aria-hidden="true"
                  className="w-full h-full object-cover"
                  draggable={false}
                />
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex gap-[6px] items-center">
                  <Badge>{news.category}</Badge>
                  <span className="text-xs text-neutral-400">2시간 전</span>
                </div>
                <h3 className="font-bold text-base text-[#1B1B1B] leading-snug line-clamp-2">
                  {news.title}
                </h3>
              </div>
            </div>
          ))}
        </Carousel>
      </section>

      <div className="w-full sticky top-0 z-10 bg-[#F5F5F5] mt-8">
        <TabBar 
          tabs={newsTabs} 
          currentTab={currentTab} 
          onTabChange={(value) => setCurrentTab(value as NewsTabType)} 
        />
      </div>

      <section className="mt-6 px-5 flex flex-col gap-[12px] pb-24">
        <h2 className="text-lg font-bold text-neutral-950">오늘의 뉴스</h2>
        
        <div className="flex flex-col gap-[12px]">
          {filteredNewsList.map((news, index) => (
            <NewCard key={index} {...news} />
          ))}
        </div>
      </section>

      <ScrollToTopButton />
    </div>
  );
}