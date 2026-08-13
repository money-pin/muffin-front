export function formatNumber(value: number) {
  return Math.abs(value).toLocaleString("ko-KR");
}

export function formatCurrency(value: number) {
  return `${formatNumber(value)}원`;
}

export function formatSignedCurrency(value: number) {
  const sign = value > 0 ? "+" : value < 0 ? "-" : "";

  return `${sign}${formatCurrency(value)}`;
}

export function getProfitColorClass(value: number) {
  if (value > 0) return "text-positive";
  if (value < 0) return "text-negative";

  return "text-neutral-600";
}
