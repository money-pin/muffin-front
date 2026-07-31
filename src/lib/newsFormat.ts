import newscardEconomy from "@/assets/newscard/newscard-economy.png";
import newscardIT from "@/assets/newscard/newscard-IT.png";
import newscardWorld from "@/assets/newscard/newscard-world.png";

// 카테고리명(한글) → 로컬 fallback 이미지.
// thumbnailUrl이 없거나 로딩 실패했을 때만 쓰인다.
// TODO(백엔드 확인): 실제 카테고리 종류 확정되면 매핑 보강
const CATEGORY_FALLBACK_IMAGE: Record<string, string> = {
  경제: newscardEconomy,
  증권: newscardEconomy,
  세계: newscardWorld,
  IT: newscardIT,
  테크: newscardIT,
};

const DEFAULT_FALLBACK_IMAGE = newscardEconomy;
const DEFAULT_CATEGORY_NAME = "경제";

export function getCategoryFallbackImage(
  categoryName: string | null | undefined,
): string {
  return categoryName
    ? (CATEGORY_FALLBACK_IMAGE[categoryName] ?? DEFAULT_FALLBACK_IMAGE)
    : DEFAULT_FALLBACK_IMAGE;
}

export function formatCategoryName(
  categoryName: string | null | undefined,
): string {
  return categoryName ?? DEFAULT_CATEGORY_NAME;
}

// thumbnailUrl 우선, 없으면 카테고리 fallback
export function getNewsImage(
  thumbnailUrl: string | null | undefined,
  categoryName: string | null | undefined,
): string {
  return thumbnailUrl && thumbnailUrl.length > 0
    ? thumbnailUrl
    : getCategoryFallbackImage(categoryName);
}

// 조회수 포맷: 6000 → "6천회", 560000 → "56만회"
export function formatViewCount(count: number): string {
  if (count >= 10000) {
    const man = Math.floor(count / 10000);
    return `${man}만회`;
  }
  if (count >= 1000) {
    const chun = Math.floor(count / 1000);
    return `${chun}천회`;
  }
  return `${count}회`;
}

// 발행일 상대 표기: 오늘/1일 전/N일 전, 그 이상은 YYYY-MM-DD
export function formatRelativeDate(isoDate: string): string {
  const published = new Date(isoDate);
  const now = new Date();

  // 자정 기준 일수 차이
  const startOfDay = (d: Date) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const diffDays = Math.floor(
    (startOfDay(now) - startOfDay(published)) / 86_400_000,
  );

  if (diffDays <= 0) return "오늘";
  if (diffDays === 1) return "1일 전";
  if (diffDays < 7) return `${diffDays}일 전`;

  const yyyy = published.getFullYear();
  const mm = String(published.getMonth() + 1).padStart(2, "0");
  const dd = String(published.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

// "2시간 전" 같은 상대 시간 (캐러셀용). 하루 이상은 formatRelativeDate로 위임
export function formatRelativeTime(isoDate: string): string {
  const published = new Date(isoDate);
  const diffMs = Date.now() - published.getTime();
  const diffMin = Math.floor(diffMs / 60_000);

  if (diffMin < 1) return "방금 전";
  if (diffMin < 60) return `${diffMin}분 전`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour}시간 전`;
  return formatRelativeDate(isoDate);
}
