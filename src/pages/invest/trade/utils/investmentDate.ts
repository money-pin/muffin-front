export function getKstDateKey(date: Date) {
  return new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Seoul" }).format(
    date,
  );
}
