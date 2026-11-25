const SEEN_KEY = "muffin:investResultSeenDate";
const seenInMemory = new Set<string>();

export function hasSeenSettlement(accountId: string, date: string) {
  const key = `${SEEN_KEY}:${accountId}`;
  if (seenInMemory.has(`${key}:${date}`)) return true;
  try {
    return localStorage.getItem(key) === date;
  } catch {
    return false;
  }
}

export function markSettlementSeen(accountId: string, date: string) {
  const key = `${SEEN_KEY}:${accountId}`;
  seenInMemory.add(`${key}:${date}`);
  try {
    localStorage.setItem(key, date);
  } catch {
    /* 저장소가 없어도 현재 실행 중 중복 노출은 막는다. */
  }
}

export function shouldShowSettlementPopup(
  alreadySeen: boolean,
  fromNotification: boolean,
  now = new Date(),
) {
  const kstHour = new Date(now.getTime() + 9 * 60 * 60 * 1000).getUTCHours();
  return !alreadySeen && (fromNotification || kstHour >= 10);
}
