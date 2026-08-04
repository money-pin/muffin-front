export function formatSignedWon(value: number) {
  const sign = value > 0 ? "+" : value < 0 ? "-" : "";
  return `${sign}${Math.abs(value).toLocaleString("ko-KR")}원`;
}

export function getRankingProfitColorClass(value: number) {
  if (value > 0) return "text-positive";
  if (value < 0) return "text-negative";

  return "text-neutral-400";
}
