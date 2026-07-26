import type { ProfitHistoryPeriod } from "@/pages/invest/stats/types";

type DatePeriod = Exclude<ProfitHistoryPeriod, "all">;
const MS_PER_DAY = 86_400_000;

function assertNever(value: never): never {
  throw new Error(`처리하지 않은 수익 내역 기간입니다: ${String(value)}`);
}

function invalidDate(period: ProfitHistoryPeriod, value: string): never {
  throw new RangeError(
    `${period} 기간의 날짜 형식이 올바르지 않습니다: ${value}`,
  );
}

function missingDate(period: DatePeriod): never {
  throw new Error(`${period} 기간의 날짜가 누락되었습니다.`);
}

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function parseIsoWeek(value: string) {
  const match = /^(\d{4})-W(\d{2})$/.exec(value);
  if (!match) invalidDate("week", value);

  const [, yearText, weekText] = match;
  const year = Number(yearText);
  const week = Number(weekText);
  if (week < 1 || week > 53) invalidDate("week", value);

  const januaryFourth = new Date(Date.UTC(year, 0, 4));
  const monday = new Date(januaryFourth);

  monday.setUTCDate(
    januaryFourth.getUTCDate() -
      ((januaryFourth.getUTCDay() + 6) % 7) +
      (week - 1) * 7,
  );

  if (formatIsoWeek(monday) !== value) invalidDate("week", value);

  return monday;
}

function parseDay(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) invalidDate("day", value);

  const date = new Date(`${value}T00:00:00Z`);
  if (
    Number.isNaN(date.getTime()) ||
    date.toISOString().slice(0, 10) !== value
  ) {
    invalidDate("day", value);
  }

  return date;
}

function parseMonth(value: string) {
  const match = /^(\d{4})-(\d{2})$/.exec(value);
  if (!match) invalidDate("month", value);

  const year = Number(match[1]);
  const month = Number(match[2]);
  if (month < 1 || month > 12) invalidDate("month", value);

  return { year, month };
}

function parseYear(value: string) {
  if (!/^\d{4}$/.test(value)) invalidDate("year", value);
  return Number(value);
}

function formatIsoWeek(date: Date) {
  const thursday = new Date(date);
  const day = thursday.getUTCDay() || 7;

  thursday.setUTCDate(thursday.getUTCDate() + 4 - day);

  const year = thursday.getUTCFullYear();
  const firstDay = new Date(Date.UTC(year, 0, 1));
  const week = Math.ceil(
    ((thursday.getTime() - firstDay.getTime()) / MS_PER_DAY + 1) / 7,
  );

  return `${year}-W${pad(week)}`;
}

export function shiftProfitHistoryDate(
  period: DatePeriod,
  value: string,
  amount: -1 | 1,
) {
  switch (period) {
    case "day": {
      const date = parseDay(value);
      date.setUTCDate(date.getUTCDate() + amount);
      return date.toISOString().slice(0, 10);
    }
    case "week": {
      const date = parseIsoWeek(value);
      date.setUTCDate(date.getUTCDate() + amount * 7);
      return formatIsoWeek(date);
    }
    case "month": {
      const { year, month } = parseMonth(value);
      const date = new Date(Date.UTC(year, month - 1 + amount, 1));
      return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}`;
    }
    case "year":
      return String(parseYear(value) + amount);
    default:
      return assertNever(period);
  }
}

export function formatProfitHistoryTitle(period: "all"): string;
export function formatProfitHistoryTitle(
  period: DatePeriod,
  value: string,
): string;
export function formatProfitHistoryTitle(
  period: ProfitHistoryPeriod,
  value?: string,
) {
  if (period === "all") return "총 누적 수익률";
  if (!value) missingDate(period);

  switch (period) {
    case "day": {
      const date = parseDay(value);
      return `${date.getUTCMonth() + 1}월 ${date.getUTCDate()}일 수익률`;
    }
    case "week": {
      const monday = parseIsoWeek(value);
      const thursday = new Date(monday);
      thursday.setUTCDate(monday.getUTCDate() + 3);

      const month = thursday.getUTCMonth() + 1;
      const weekOfMonth = Math.ceil(thursday.getUTCDate() / 7);
      return `${month}월 ${weekOfMonth}주차 수익률`;
    }
    case "month": {
      const { month } = parseMonth(value);
      return `${month}월 수익률`;
    }
    case "year": {
      const year = parseYear(value);
      return `${String(year).slice(-2)}년도 수익률`;
    }
    default:
      return assertNever(period);
  }
}
