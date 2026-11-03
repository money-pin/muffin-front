import { apiRequest } from "./api";

// ── 모닝 머핀 브리핑 (CONTENT-09) 응답 타입 ──────────────────────

// GENERATING·READY: 아직 공개 전 / PUBLISHED: 공개 / UNAVAILABLE: 그날 브리핑 없음
export type BriefingStatus =
  "GENERATING" | "READY" | "PUBLISHED" | "UNAVAILABLE";

export interface BriefingSectorChip {
  sectorCode: string;
  sectorName: string;
}

export interface BriefingIssue {
  order: number;
  title: string;
  summary: string;
  // "그래서 나한테는?" 문구
  impactLine: string;
  // NEUTRAL을 제외한 관련 섹터 (최대 2개)
  sectors: BriefingSectorChip[];
  newsId: number | null;
  // 근거 기사를 열 수 있는지 (false면 [뉴스보기] 숨김)
  articleAvailable: boolean;
}

export interface BriefingResponse {
  briefingDate: string; // YYYY-MM-DD
  status: BriefingStatus;
  // 주말에 금요일 브리핑으로 대체되면 false
  isToday: boolean;
  // 오늘의 한 줄
  headline: string | null;
  issues: BriefingIssue[];
}

export interface BriefingViewResponse {
  briefingDate: string;
  viewedAt: string;
}

// ── API ─────────────────────────────────────────────

export async function getTodayBriefing(): Promise<BriefingResponse> {
  return apiRequest<BriefingResponse>("/api/briefings/today", { auth: true });
}

export async function getBriefing(
  briefingDate: string,
): Promise<BriefingResponse> {
  return apiRequest<BriefingResponse>(
    `/api/briefings/${encodeURIComponent(briefingDate)}`,
    { auth: true },
  );
}

export async function recordBriefingView(
  briefingDate: string,
): Promise<BriefingViewResponse> {
  return apiRequest<BriefingViewResponse>(
    `/api/briefings/${encodeURIComponent(briefingDate)}/views`,
    { method: "POST", auth: true },
  );
}

// 화면에 보여줄 수 있는 브리핑인지
export function isBriefingVisible(briefing: BriefingResponse | undefined) {
  return (
    briefing?.status === "PUBLISHED" &&
    Boolean(briefing.headline) &&
    briefing.issues.length > 0
  );
}
