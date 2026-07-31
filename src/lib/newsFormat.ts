import newscardEconomy from "@/assets/newscard/newscard-economy.png";
import newscardIT from "@/assets/newscard/newscard-IT.png";
import newscardWorld from "@/assets/newscard/newscard-world.png";

const CATEGORY_FALLBACK_IMAGE: Record<string, string> = {
  경제: newscardEconomy,
  증권: newscardIT,
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

export function getNewsImage(
  thumbnailUrl: string | null | undefined,
  categoryName: string | null | undefined,
): string {
  return thumbnailUrl && thumbnailUrl.length > 0
    ? thumbnailUrl
    : getCategoryFallbackImage(categoryName);
}

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

export function formatRelativeDate(isoDate: string): string {
  const published = new Date(isoDate);
  const now = new Date();

  const startOfDay = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
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
