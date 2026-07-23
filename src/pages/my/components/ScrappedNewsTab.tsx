import { useState } from "react";
import SortDropdown from "../../../components/common/SortDropdown";
import NewCard from "../../news/components/NewsCard";

type SortValue = "recent" | "upload" | "views";

export default function ScrappedNewsTab() {
  // 📌 setSetSortValue -> setSortValue 중복 오타 수정
  const [sortValue, setSortValue] = useState<SortValue>("recent");

  const sortOptions = [
    { value: "recent", label: "최근 저장순" },
    { value: "upload", label: "업로드순" },
    { value: "views", label: "조회수순" },
  ] as const;

  const scrappedNewsList = [
    {
      id: 1,
      title: "국내 테크 기업 실적 발표 앞두고 기대감 고조",
      category: "IT",
      date: "2026-05-06",
      views: "1,567회",
      imageType: "IT" as const,
      timestamp: 1778092800000,
      rawViews: 1567,
    },
    {
      id: 2,
      title: "에너지 섹터 투자 포인트",
      category: "경제",
      date: "2026-05-08",
      views: "1,203회",
      imageType: "economy" as const,
      timestamp: 1778265600000,
      rawViews: 1203,
    },
    {
      id: 3,
      title: "국내 증시 외국인 순매수세 지속",
      category: "경제",
      date: "2026-05-06",
      views: "2,890회",
      imageType: "economy" as const,
      timestamp: 1778092800000,
      rawViews: 2890,
    },
    {
      id: 4,
      title: "미국 금리 동결 전망 분석",
      category: "세계",
      date: "2026-05-07",
      views: "3,421회",
      imageType: "world" as const,
      timestamp: 1778179200000,
      rawViews: 3421,
    },
    {
      id: 5,
      title: "코인 시장 변동성 확대 대응 전략",
      category: "경제",
      date: "2026-05-08",
      views: "6,000회",
      imageType: "economy" as const,
      timestamp: 1778265600000,
      rawViews: 6000,
    },
  ];

  const sortedNewsList = [...scrappedNewsList].sort((a, b) => {
    if (sortValue === "recent") return b.id - a.id;
    if (sortValue === "upload") return b.timestamp - a.timestamp;
    if (sortValue === "views") return b.rawViews - a.rawViews;
    return 0;
  });

  return (
    <div className="w-full flex flex-col mt-0 pt-0">
      <div className="w-full flex justify-end px-5 py-2 mt-0">
        <SortDropdown
          options={sortOptions}
          value={sortValue}
          /* 📌 setSortValue 호출로 변경 */
          onChange={(val) => setSortValue(val as SortValue)}
          align="end"
        />
      </div>

      <section className="px-5 flex flex-col gap-[12px] mt-1">
        {sortedNewsList.map((news) => (
          <NewCard
            key={news.id}
            title={news.title}
            category={news.category}
            date={news.date}
            views={news.views}
            imageType={news.imageType}
          />
        ))}
      </section>
    </div>
  );
}