import { useQueryClient } from "@tanstack/react-query";

import bookmarkFillIcon from "@/assets/icon-24px/bookmark-fill.svg";
import bookmarkWhiteIcon from "@/assets/icon-24px/bookmark-line-white.svg";
import type { MyHome } from "@/lib/mypageApi";
import { mypageQueryKeys } from "@/lib/mypageQueries";
import { useToggleScrap } from "@/pages/news/newsQueries";
import type { MyRecentNews } from "@/pages/my/myData";

interface RecentNewsListProps {
  newsList: MyRecentNews[];
  onNewsClick: (newsId: number) => void;
}

// mypage/home 캐시의 recentNews[].isScrapped를 갱신해 북마크 아이콘을 즉시 반영한다.
function setHomeScrap(
  queryClient: ReturnType<typeof useQueryClient>,
  newsId: number,
  isScrapped: boolean,
) {
  queryClient.setQueryData<MyHome>(mypageQueryKeys.home(), (old) =>
    old
      ? {
          ...old,
          recentNews: old.recentNews?.map((news) =>
            news.newsId === newsId ? { ...news, isScrapped } : news,
          ),
        }
      : old,
  );
}

// 카드마다 useToggleScrap 훅이 필요하므로 카드를 별도 컴포넌트로 분리한다.
// 북마크 버튼은 카드 버튼의 형제로 두어(버튼 중첩 방지) 카드 클릭과 독립적으로 동작.
function RecentNewsCard({
  news,
  onNewsClick,
}: {
  news: MyRecentNews;
  onNewsClick: (newsId: number) => void;
}) {
  const queryClient = useQueryClient();
  const { mutate: toggleScrap, isPending } = useToggleScrap(news.id);

  const handleBookmark = () => {
    if (isPending) return;
    const next = !news.bookmarked;
    setHomeScrap(queryClient, news.id, next); // 낙관적 갱신
    toggleScrap(next, {
      onError: () => setHomeScrap(queryClient, news.id, !next), // 실패 시 롤백
    });
  };

  return (
    <div className="relative w-[130px] shrink-0">
      <button
        type="button"
        onClick={() => onNewsClick(news.id)}
        className="flex w-full flex-col gap-2 text-left"
      >
        <div className="h-[130px] w-[130px] overflow-hidden rounded-[12px]">
          <img
            src={news.image}
            alt=""
            className="h-full w-full object-cover"
            draggable={false}
          />
        </div>
        <p className="text-body-14-md line-clamp-2 break-keep text-neutral-900">
          {news.title}
        </p>
      </button>

      <button
        type="button"
        onClick={handleBookmark}
        disabled={isPending}
        aria-label={news.bookmarked ? "스크랩 해제" : "스크랩"}
        aria-pressed={news.bookmarked}
        className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center"
      >
        <img
          src={news.bookmarked ? bookmarkFillIcon : bookmarkWhiteIcon}
          alt=""
          aria-hidden="true"
          className="h-6 w-6"
          draggable={false}
        />
      </button>
    </div>
  );
}

// Figma 최근 읽은 뉴스: 가로 스크롤 카드(이미지 + 북마크 오버레이 + 제목 2줄)
export default function RecentNewsList({
  newsList,
  onNewsClick,
}: RecentNewsListProps) {
  return (
    <div className="-mx-5 flex [scrollbar-width:none] gap-3 overflow-x-auto px-5 [&::-webkit-scrollbar]:hidden">
      {newsList.map((news) => (
        <RecentNewsCard key={news.id} news={news} onNewsClick={onNewsClick} />
      ))}
    </div>
  );
}
