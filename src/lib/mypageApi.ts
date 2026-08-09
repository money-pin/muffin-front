import { apiRequest, ApiError } from "./api";

// 백엔드가 온보딩 미완료 계정에 홈/마이 응답으로 내려주는 코드
const ONBOARDING_REQUIRED_CODE = "USER_409_001";

// 닉네임 변경 (온보딩 완료·마이페이지 공용). 변경된 닉네임을 반환한다.
export async function updateNickname(
  nickname: string,
): Promise<{ nickname: string }> {
  return apiRequest<{ nickname: string }>("/api/mypage/nickname", {
    method: "PATCH",
    body: { nickname },
    auth: true,
  });
}

export interface MyHomeCharacter {
  characterId: number;
  characterType: "PLAIN" | "SPRINKLE" | "BUTTER" | (string & {});
  characterName: string;
  characterImageUrl: string;
}

export type WeekDay = "SUN" | "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT";

export interface MyHomeWeeklyDay {
  day: WeekDay | (string & {});
  participated: boolean;
}

export interface MyHomeStreak {
  currentStreak: number;
  maxStreak: number;
  weeklyActivity: MyHomeWeeklyDay[];
}

export interface MyHomeRecentNews {
  newsId: number;
  title: string;
  categoryName: string | null;
  thumbnailUrl: string | null;
  viewCount: number;
  publishedAt: string;
  viewedAt: string;
  isScrapped: boolean;
}

// 마이페이지 홈 (GET /api/mypage/home): 닉네임·캐릭터·스트릭·최근 읽은 뉴스
export interface MyHome {
  nickname: string;
  character: MyHomeCharacter;
  streak?: MyHomeStreak;
  recentNews?: MyHomeRecentNews[];
}

// 홈 프로필 조회 (GET /api/mypage/home)
export async function getMyHome(): Promise<MyHome> {
  return apiRequest<MyHome>("/api/mypage/home", { auth: true });
}

// 로그인 후 진입 경로 결정.
// 온보딩 완료면 홈, 미완료(백엔드가 홈/마이에 409 USER_409_001)면 온보딩으로 보낸다.
export async function resolveEntryRoute(): Promise<"/home" | "/onboarding"> {
  try {
    await getMyHome();
    return "/home";
  } catch (error) {
    if (error instanceof ApiError && error.code === ONBOARDING_REQUIRED_CODE) {
      return "/onboarding";
    }
    // 그 외 오류(네트워크 등)는 일단 홈으로 — 홈에서 재조회/처리
    return "/home";
  }
}

function toQuery(params: Record<string, string | number | undefined>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") search.set(key, String(value));
  }
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

// ── 스크랩한 뉴스 목록 (GET /api/mypage/scraps, 커서 페이지네이션) ──
export interface ScrapItem {
  newsId: number;
  title: string;
  categoryName: string | null;
  thumbnailUrl: string | null;
  viewCount: number;
  publishedAt: string;
  scrappedAt: string;
}

export interface ScrapListResult {
  items: ScrapItem[];
  nextCursor: string | null;
  hasNext: boolean;
}

export function getScraps(params?: {
  cursor?: string;
  size?: number;
  sort?: string;
}): Promise<ScrapListResult> {
  return apiRequest<ScrapListResult>(
    `/api/mypage/scraps${toQuery({ ...params })}`,
    { auth: true },
  );
}

// ── 최근 읽은 뉴스 목록 (GET /api/mypage/recent-news, 커서 페이지네이션, viewedAt 최신순) ──
export interface RecentNewsListItem {
  newsId: number;
  title: string;
  categoryName: string | null;
  thumbnailUrl: string | null;
  viewCount: number;
  publishedAt: string;
  viewedAt: string;
}

export interface RecentNewsListResult {
  items: RecentNewsListItem[];
  nextCursor: string | null;
  hasNext: boolean;
}

export function getRecentNews(params?: {
  cursor?: string;
  size?: number;
}): Promise<RecentNewsListResult> {
  return apiRequest<RecentNewsListResult>(
    `/api/mypage/recent-news${toQuery({ ...params })}`,
    { auth: true },
  );
}

// ── 저장한 용어 목록 (GET /api/mypage/saved-terms, page 페이지네이션) ──
export interface SavedTermItem {
  termId: number;
  term: string;
  content: string;
  savedAt: string;
}

export interface SavedTermListResult {
  savedTerms: SavedTermItem[];
  page: number;
  size: number;
  hasNext: boolean;
}

export function getSavedTerms(params?: {
  page?: number;
  size?: number;
  sort?: string;
}): Promise<SavedTermListResult> {
  return apiRequest<SavedTermListResult>(
    `/api/mypage/saved-terms${toQuery({ ...params })}`,
    { auth: true },
  );
}

// ── 알림 설정 (GET/PATCH /api/mypage/settings/notifications) ──
export interface NotificationSettings {
  newsUpdate: boolean;
  dailyQuiz: boolean;
  investResult: boolean;
  rankingChange: boolean;
}

// 응답은 { notifications: {...} } 로 래핑되어 온다
interface MyPageSettings {
  notifications: NotificationSettings;
}

export async function getNotificationSettings(): Promise<NotificationSettings> {
  const result = await apiRequest<MyPageSettings>(
    "/api/mypage/settings/notifications",
    { auth: true },
  );
  return result.notifications;
}

export async function updateNotificationSettings(
  body: NotificationSettings,
): Promise<NotificationSettings> {
  const result = await apiRequest<MyPageSettings>(
    "/api/mypage/settings/notifications",
    { method: "PATCH", body, auth: true },
  );
  return result.notifications;
}

// ── 닉네임 중복 확인 (GET /api/mypage/nickname/check) ──
export function checkNickname(
  nickname: string,
): Promise<{ available: boolean }> {
  return apiRequest<{ available: boolean }>(
    `/api/mypage/nickname/check${toQuery({ nickname })}`,
    { auth: true },
  );
}
