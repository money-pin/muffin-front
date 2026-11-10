import type { ProfitTrendPoint } from "@/pages/invest/stats/types";

const GRID_STEP_COUNT = 4;
const RECENT_DAY_COUNT = 7;
const MS_PER_DAY = 86_400_000;
const KST_OFFSET_MS = 9 * 60 * 60 * 1_000;
const AXIS_PADDING_RATIO = 0.15;
const MIN_AXIS_PADDING = 0.1;
const EMPTY_AXIS_RANGE = { minY: 0, maxY: 10 };

function getNiceStep(value: number) {
  if (value <= 0) return 1;
  const magnitude = 10 ** Math.floor(Math.log10(value));
  const normalized = value / magnitude;
  const niceNormalized =
    normalized <= 1
      ? 1
      : normalized <= 2
        ? 2
        : normalized <= 2.5
          ? 2.5
          : normalized <= 5
            ? 5
            : 10;
  return niceNormalized * magnitude;
}

function getAxisRange(data: ProfitTrendPoint[]) {
  const minValue = Math.min(...data.map((point) => point.value), 0);
  const maxValue = Math.max(...data.map((point) => point.value), 0);
  if (minValue === 0 && maxValue === 0) return EMPTY_AXIS_RANGE;

  // 기존 작은 값 구간의 눈금을 유지한다.
  if (minValue >= -1 && maxValue <= 1) return { minY: -2, maxY: 2 };

  const padding = Math.max(
    (maxValue - minValue) * AXIS_PADDING_RATIO,
    MIN_AXIS_PADDING,
  );
  const paddedMin = minValue < 0 ? minValue - padding : 0;
  const paddedMax = maxValue > 0 ? maxValue + padding : 0;
  const step = getNiceStep((paddedMax - paddedMin) / GRID_STEP_COUNT);
  return {
    minY: Math.floor(paddedMin / step) * step,
    maxY: Math.ceil(paddedMax / step) * step,
  };
}

function formatDateLabel(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  return match ? `${Number(match[2])}/${Number(match[3])}` : value;
}

export function formatProfitGraphRate(value: number) {
  return `${Number(value.toFixed(2))}%`;
}

export function getRecentKstGraphLabels(now = new Date()) {
  const kstToday = new Date(now.getTime() + KST_OFFSET_MS)
    .toISOString()
    .slice(0, 10);
  const endTime = Date.parse(`${kstToday}T00:00:00Z`);
  return Array.from({ length: RECENT_DAY_COUNT }, (_, index) => {
    const date = new Date(
      endTime - (RECENT_DAY_COUNT - 1 - index) * MS_PER_DAY,
    );
    return `${date.getUTCMonth() + 1}/${date.getUTCDate()}`;
  });
}

// 정상적인 0%는 유지하고 잘못된 숫자만 제외한다. 날짜·순서는 서버 응답을 따른다.
export function createProfitRateGraphModel(
  data: ProfitTrendPoint[],
  now = new Date(),
) {
  const points = data.filter((point) => Number.isFinite(point.value));
  const labels = points.length
    ? points.map((point) => formatDateLabel(point.label))
    : getRecentKstGraphLabels(now);
  const { minY, maxY } = getAxisRange(points);
  const ticks = Array.from(
    { length: GRID_STEP_COUNT + 1 },
    (_, index) => maxY - ((maxY - minY) / GRID_STEP_COUNT) * index,
  );
  return { points, labels, minY, maxY, ticks };
}

// 첫 날짜와 마지막 날짜를 유지하고, 겹칠 때만 중간 라벨의 표시 간격을 늘린다.
export function getProfitGraphLabelIndices(
  labelWidths: number[],
  plotWidth: number,
) {
  if (labelWidths.length <= 1) return labelWidths.map((_, index) => index);
  const lastIndex = labelWidths.length - 1;
  const gap = 4;
  for (let stride = 1; stride <= lastIndex; stride++) {
    const indices = labelWidths
      .map((_, index) => index)
      .filter((index) => index % stride === 0 || index === lastIndex);
    const fits = indices.every((index, position) => {
      if (position === 0) return true;
      const previous = indices[position - 1];
      return (
        ((index - previous) / lastIndex) * plotWidth >=
        (labelWidths[previous] + labelWidths[index]) / 2 + gap
      );
    });
    if (fits) return indices;
  }
  return [0, lastIndex];
}
