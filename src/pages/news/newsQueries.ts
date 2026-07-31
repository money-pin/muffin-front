import {
  useInfiniteQuery,
  useQuery,
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import {
  getNewsList,
  getTodayNews,
  getNewsDetail,
  readNews,
  getSectorImpacts,
  getExplanationCards,
  getTerm,
  scrapNews,
  unscrapNews,
  saveTerm,
  unsaveTerm,
  type NewsDetailResponse,
  type NewsListItem,
  type NewsListResponse,
  type TermResponse,
} from "@/lib/newsApi";

// 쿼리 키를 한 곳에서 관리 (팀에 별도 컨벤션 생기면 여기만 바꾸면 됨)
export const newsKeys = {
  all: ["news"] as const,
  list: (categoryId?: number) => ["news", "list", categoryId ?? "all"] as const,
  today: () => ["news", "today"] as const,
  detail: (newsId: number) => ["news", "detail", newsId] as const,
  sectorImpacts: (newsId: number) =>
    ["news", "sector-impacts", newsId] as const,
  explanationCards: (newsId: number) =>
    ["news", "explanation-cards", newsId] as const,
  term: (termId: number) => ["news", "term", termId] as const,
};

const PAGE_SIZE = 20;
const NEWS_LIST_QUERY_KEY = ["news", "list"] as const;
type TodayNewsResponse = { items: NewsListItem[] };

// 뉴스 목록 (커서 기반 무한스크롤). categoryId를 넘기면 카테고리 필터.
export function useNewsList(categoryId?: number) {
  return useInfiniteQuery({
    queryKey: newsKeys.list(categoryId),
    queryFn: ({ pageParam }) =>
      getNewsList({
        cursor: pageParam,
        size: PAGE_SIZE,
        categoryId,
      }),
    initialPageParam: undefined as string | undefined,
    // hasNext가 false면 nextCursor를 반환하지 않아 다음 페이지 요청이 멈춘다
    getNextPageParam: (lastPage) =>
      lastPage.hasNext ? lastPage.nextCursor : undefined,
  });
}

// 오늘의 뉴스 (캐러셀용, 3건)
export function useTodayNews() {
  return useQuery({
    queryKey: newsKeys.today(),
    queryFn: getTodayNews,
  });
}

// 뉴스 상세 본문
export function useNewsDetail(newsId: number) {
  return useQuery({
    queryKey: newsKeys.detail(newsId),
    queryFn: () => getNewsDetail(newsId),
    enabled: Number.isFinite(newsId),
  });
}

// 열람 처리(조회수 +1). 화면 진입당 1회만 호출하는 용도.
// 성공 시 상세 캐시의 viewCount를 응답값으로 갱신. 실패는 조용히 무시(정책).
export function useReadNews(newsId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => readNews(newsId),
    retry: false, // 자동 재시도 안 함(정책)
    onSuccess: ({ viewCount }) => {
      const key = newsKeys.detail(newsId);
      const previous = queryClient.getQueryData<NewsDetailResponse>(key);
      if (previous) {
        queryClient.setQueryData<NewsDetailResponse>(key, {
          ...previous,
          viewCount,
        });
      }
    },
    // onError 없음: 실패해도 사용자에게 노출하지 않음(정책)
  });
}

// 섹터 영향도
export function useSectorImpacts(newsId: number) {
  return useQuery({
    queryKey: newsKeys.sectorImpacts(newsId),
    queryFn: () => getSectorImpacts(newsId),
    enabled: Number.isFinite(newsId),
  });
}

// 해설 카드. 생성 미완료(409)면 에러로 오므로, 재시도는 하지 않는다.
export function useExplanationCards(newsId: number) {
  return useQuery({
    queryKey: newsKeys.explanationCards(newsId),
    queryFn: () => getExplanationCards(newsId),
    enabled: Number.isFinite(newsId),
    retry: false,
  });
}

// 용어 사전. 바텀시트를 열 때만(termId가 있을 때만) 조회.
export function useTerm(termId: number | null) {
  return useQuery({
    queryKey: newsKeys.term(termId ?? -1),
    queryFn: () => getTerm(termId as number),
    enabled: termId != null,
  });
}

// 스크랩 토글. 상세 캐시의 isScrapped를 낙관적으로 뒤집는다.
export function useToggleScrap(newsId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (nextScrapped: boolean) =>
      nextScrapped ? scrapNews(newsId) : unscrapNews(newsId),
    onMutate: async (nextScrapped) => {
      const detailKey = newsKeys.detail(newsId);
      const todayKey = newsKeys.today();

      await Promise.all([
        queryClient.cancelQueries({ queryKey: detailKey }),
        queryClient.cancelQueries({ queryKey: todayKey }),
        queryClient.cancelQueries({ queryKey: NEWS_LIST_QUERY_KEY }),
      ]);

      const previousDetail =
        queryClient.getQueryData<NewsDetailResponse>(detailKey);
      const previousToday =
        queryClient.getQueryData<TodayNewsResponse>(todayKey);
      const previousLists = queryClient.getQueriesData<
        InfiniteData<NewsListResponse>
      >({
        queryKey: NEWS_LIST_QUERY_KEY,
      });

      if (previousDetail) {
        queryClient.setQueryData<NewsDetailResponse>(detailKey, {
          ...previousDetail,
          isScrapped: nextScrapped,
        });
      }

      if (previousToday) {
        queryClient.setQueryData<TodayNewsResponse>(todayKey, {
          ...previousToday,
          items: previousToday.items.map((item) =>
            item.newsId === newsId
              ? { ...item, isScrapped: nextScrapped }
              : item,
          ),
        });
      }

      queryClient.setQueriesData<InfiniteData<NewsListResponse>>(
        { queryKey: NEWS_LIST_QUERY_KEY },
        (previous) =>
          previous
            ? {
                ...previous,
                pages: previous.pages.map((page) => ({
                  ...page,
                  items: page.items.map((item) =>
                    item.newsId === newsId
                      ? { ...item, isScrapped: nextScrapped }
                      : item,
                  ),
                })),
              }
            : previous,
      );

      return { previousDetail, previousToday, previousLists };
    },
    onError: (_err, _next, context) => {
      if (context?.previousDetail) {
        queryClient.setQueryData(
          newsKeys.detail(newsId),
          context.previousDetail,
        );
      }

      if (context?.previousToday) {
        queryClient.setQueryData(newsKeys.today(), context.previousToday);
      }

      context?.previousLists.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: newsKeys.detail(newsId) });
      queryClient.invalidateQueries({ queryKey: newsKeys.today() });
      queryClient.invalidateQueries({ queryKey: NEWS_LIST_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["mypage", "scraps"] });
    },
  });
}

// 용어 저장 토글. 용어 캐시의 isSaved를 낙관적으로 뒤집는다.
export function useToggleTermSave(termId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (nextSaved: boolean) =>
      nextSaved ? saveTerm(termId) : unsaveTerm(termId),
    onMutate: async (nextSaved) => {
      const key = newsKeys.term(termId);
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<TermResponse>(key);
      if (previous) {
        queryClient.setQueryData<TermResponse>(key, {
          ...previous,
          isSaved: nextSaved,
        });
      }
      return { previous };
    },
    onError: (_err, _next, context) => {
      if (context?.previous) {
        queryClient.setQueryData(newsKeys.term(termId), context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: newsKeys.term(termId) });
      queryClient.invalidateQueries({ queryKey: ["mypage", "saved-terms"] });
    },
  });
}
