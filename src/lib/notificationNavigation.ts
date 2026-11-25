const STORAGE_KEY = "muffin:notificationDestination";
const MAX_AGE_MS = 30 * 60 * 1000;

function isDate(value: string) {
  return (
    /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    new Date(`${value}T00:00:00Z`).toISOString().slice(0, 10) === value
  );
}

// 알림 발송 payload의 URL만 받는다. 임의 외부 주소·로그인 화면으로의 이동은 허용하지 않는다.
export function resolveNotificationDestination(
  input: unknown,
  origin: string,
): string | null {
  if (
    typeof input !== "string" ||
    !input ||
    input !== input.trim() ||
    input.includes("\\") ||
    [...input].some((character) => character.charCodeAt(0) <= 32) ||
    /%2e|%2f|%5c/i.test(input) ||
    /(?:^|\/)\.{1,2}(?:\/|$)/.test(input.split("?")[0])
  )
    return null;
  try {
    const url = new URL(input, origin);
    if (url.protocol === "muffin:" && !input.startsWith("muffin://"))
      return null;
    if (url.username || url.password || url.hash) return null;
    const path =
      url.protocol === "muffin:"
        ? `/${url.hostname}${url.pathname}`
        : url.origin === origin
          ? url.pathname
          : null;
    if (!path || (url.protocol === "muffin:" && url.port)) return null;
    if (path === "/home")
      return url.searchParams.get("popup") === "settlement"
        ? "/home?popup=settlement"
        : "/home";
    if (path === "/quiz" || path === "/quiz/today") return "/quiz";
    if (path === "/ranking" || path === "/invest/ranking")
      return "/invest/ranking";
    if (
      /^\/news\/[1-9]\d*$/.test(path) &&
      Number.isSafeInteger(Number(path.slice(6)))
    )
      return `${path}?from=notification`;
    if (path === "/briefing" || /^\/briefing\/\d{4}-\d{2}-\d{2}$/.test(path)) {
      const date =
        path === "/briefing" ? url.searchParams.get("date") : path.slice(10);
      if (date !== null && !isDate(date)) return null;
      return date
        ? `/briefing?date=${date}&from=notification`
        : "/briefing?from=notification";
    }
    return null;
  } catch {
    return null;
  }
}

export function clearNotificationDestination() {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    /* 저장소 사용 불가 */
  }
}

export function rememberNotificationDestination(input: string) {
  const path = resolveNotificationDestination(input, window.location.origin);
  if (!path) return;
  try {
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ path, savedAt: Date.now() }),
    );
  } catch {
    /* 저장소 사용 불가 시 로그인 자체는 막지 않는다. */
  }
}

export function consumeNotificationDestination(): string | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    clearNotificationDestination();
    if (!raw) return null;
    const value = JSON.parse(raw);
    const age = Date.now() - value.savedAt;
    if (
      typeof value.savedAt !== "number" ||
      !Number.isFinite(age) ||
      age < 0 ||
      age > MAX_AGE_MS
    )
      return null;
    return resolveNotificationDestination(value.path, window.location.origin);
  } catch {
    return null;
  }
}

export function resolvePostLoginDestination(entry: "/home" | "/onboarding") {
  // 온보딩을 먼저 끝내야 하므로 목적지는 그동안 소비하지 않는다.
  return entry === "/onboarding"
    ? entry
    : (consumeNotificationDestination() ?? entry);
}
