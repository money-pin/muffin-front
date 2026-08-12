import { apiRequest } from "./api";

// ── 응답 타입 (OpenAPI 스펙 기준) ──────────────────────────────

// 뉴스 목록/오늘의 뉴스 공통 아이템
export interface NewsListItem {
  newsId: number;
  categoryId: number;
  categoryName: string | null;
  title: string;
  summary: string;
  publisher: string;
  publishedAt: string; // ISO date-time
  thumbnailUrl: string | null;
  viewCount: number;
  isScrapped: boolean;
}

// 커서 페이지네이션 응답 (뉴스 목록)
export interface NewsListResponse {
  items: NewsListItem[];
  nextCursor?: string; // 다음 페이지 없으면 생략됨
  hasNext: boolean;
}

// 본문 조각. type이 "HIGHLIGHT"이면 termId가 있고, 클릭 시 용어 바텀시트를 연다
export interface BodySegment {
  type: "TEXT" | "HIGHLIGHT";
  text: string;
  termId?: number;
}

// 뉴스 상세 (GET /api/news/{newsId})
export interface NewsDetailResponse {
  newsId: number;
  title: string;
  categoryName: string | null;
  viewCount: number;
  publisher: string;
  publishedAt: string;
  thumbnailUrl: string | null;
  originalUrl: string;
  bodySegments: BodySegment[];
  isScrapped: boolean;
}

// 섹터 영향도 3단계
export type SectorImpact = "POSITIVE" | "NEUTRAL" | "NEGATIVE";

export interface SectorImpactItem {
  sectorCode: string;
  sectorName: string;
  impact: SectorImpact;
}

export interface NewsSectorImpactResponse {
  newsId: number;
  sectorImpacts: SectorImpactItem[];
}

// 해설 카드 (경제 상식 탭)
export interface NewsExplanationCard {
  cardOrder: number;
  title: string;
  keyTerm: string;
  content: string;
}

export interface NewsExplanationCardsResponse {
  newsId: number;
  cards: NewsExplanationCard[];
}

// 용어 사전
export interface TermResponse {
  termId: number;
  term: string;
  content: string;
  isSaved: boolean;
}

// 스크랩 토글 결과
export interface ScrapResponse {
  newsId: number;
  isScrapped: boolean;
  scrappedAt: string | null;
}

// 용어 저장 토글 결과
export interface TermSaveResponse {
  termId: number;
  term: string;
  isSaved: boolean;
  savedAt: string | null;
}

// ── API 함수 ──────────────────────────────────────────────────

// 뉴스 목록 조회 (커서 페이지네이션). 인증 불필요.
// categoryId 미지정 시 전체 카테고리.
export async function getNewsList(params: {
  cursor?: string;
  size?: number;
  categoryId?: number;
}): Promise<NewsListResponse> {
  const query = new URLSearchParams();
  if (params.cursor) query.set("cursor", params.cursor);
  if (params.size) query.set("size", String(params.size));
  if (params.categoryId != null)
    query.set("categoryId", String(params.categoryId));

  const qs = query.toString();
  return apiRequest<NewsListResponse>(`/api/news${qs ? `?${qs}` : ""}`, {
    auth: true,
  });
}

// 오늘의 뉴스 조회 (당일 최신 3건). "따끈한 금융 소식" 캐러셀용.
export async function getTodayNews(): Promise<{ items: NewsListItem[] }> {
  return apiRequest<{ items: NewsListItem[] }>("/api/news/today", {
    auth: true,
  });
}

// 뉴스 상세 조회. 상세 정보만 조회하며 조회수·열람기록은 건드리지 않는다.
export async function getNewsDetail(
  newsId: number,
): Promise<NewsDetailResponse> {
  return apiRequest<NewsDetailResponse>(`/api/news/${newsId}`, {
    auth: true,
  });
}

// 뉴스 열람 처리. 상세 조회 성공 후 화면 진입당 1회 호출. 조회수를 1 증가시키고
// 갱신된 viewCount를 반환한다. 실패해도 사용자에게 노출하지 않는 정책.
export async function readNews(newsId: number): Promise<{ viewCount: number }> {
  return apiRequest<{ viewCount: number }>(`/api/news/${newsId}/views`, {
    method: "POST",
    body: {},
    auth: true,
  });
}

// 뉴스 섹터 영향도 조회 (12개 섹터, 없으면 NEUTRAL).
export async function getSectorImpacts(
  newsId: number,
): Promise<NewsSectorImpactResponse> {
  return apiRequest<NewsSectorImpactResponse>(
    `/api/news/${newsId}/sector-impacts`,
    { auth: true },
  );
}

// 뉴스 해설 카드 조회. 생성 미완료면 서버가 409를 던진다(ApiError로 처리).
export async function getExplanationCards(
  newsId: number,
): Promise<NewsExplanationCardsResponse> {
  return apiRequest<NewsExplanationCardsResponse>(
    `/api/news/${newsId}/explanation-cards`,
    { auth: true },
  );
}

// 용어 사전 조회 (바텀시트). 본문 term 조각을 탭할 때 termId로 호출.
export async function getTerm(termId: number): Promise<TermResponse> {
  return apiRequest<TermResponse>(`/api/terms/${termId}`, { auth: true });
}

// 뉴스 스크랩 (멱등). isScrapped=true 반환.
export async function scrapNews(newsId: number): Promise<ScrapResponse> {
  return apiRequest<ScrapResponse>(`/api/news/${newsId}/scrap`, {
    method: "PUT",
    body: {},
    auth: true,
  });
}

// 뉴스 스크랩 해제 (멱등). isScrapped=false 반환.
export async function unscrapNews(newsId: number): Promise<ScrapResponse> {
  return apiRequest<ScrapResponse>(`/api/news/${newsId}/scrap`, {
    method: "DELETE",
    body: {},
    auth: true,
  });
}

// 용어 저장 (학습 저장소).
export async function saveTerm(termId: number): Promise<TermSaveResponse> {
  return apiRequest<TermSaveResponse>(`/api/terms/${termId}/saved-term`, {
    method: "PUT",
    auth: true,
  });
}

// 용어 저장 해제.
export async function unsaveTerm(termId: number): Promise<TermSaveResponse> {
  return apiRequest<TermSaveResponse>(`/api/terms/${termId}/saved-term`, {
    method: "DELETE",
    auth: true,
  });
}
