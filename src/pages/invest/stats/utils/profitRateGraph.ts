import type { ProfitTrendPoint } from "@/pages/invest/stats/types";

const TARGET_GRID_STEP_COUNT = 4;
const RECENT_DAY_COUNT = 7;
const MS_PER_DAY = 86_400_000;
const KST_OFFSET_MS = 9 * 60 * 60 * 1_000;
const AXIS_PADDING_RATIO = 0.15;
const MIN_AXIS_SPAN = 3;
const EMPTY_AXIS_RANGE = { minY: 0, maxY: 10, step: 2.5 };

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
  if (!data.length) return EMPTY_AXIS_RANGE;
  const minValue = Math.min(...data.map((point) => point.value));
  const maxValue = Math.max(...data.map((point) => point.value));
  const center = minValue + (maxValue - minValue) / 2;
  const span = Math.max(
    MIN_AXIS_SPAN,
    (maxValue - minValue) * (1 + AXIS_PADDING_RATIO * 2),
  );
  const paddedMin = center - span / 2;
  const paddedMax = center + span / 2;
  const step = getNiceStep((paddedMax - paddedMin) / TARGET_GRID_STEP_COUNT);
  let minStep = Math.floor(paddedMin / step);
  let maxStep = Math.ceil(paddedMax / step);
  // 목표는 눈금 4~6개(격자 3~5칸). 간격을 유지하며 부족한 눈금만 균형 있게 추가한다.
  while (maxStep - minStep < 3) {
    if (minValue - minStep * step <= maxStep * step - maxValue) minStep--;
    else maxStep++;
  }
  return {
    minY: minStep * step,
    maxY: maxStep * step,
    step,
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
  const { minY, maxY, step } = getAxisRange(points);
  // 범위를 다시 4등분하면 -3.75% 같은 눈금이 생긴다. 계산한 간격을 유지한다.
  const ticks = Array.from(
    { length: Math.round((maxY - minY) / step) + 1 },
    (_, index) => Number((maxY - step * index).toPrecision(12)),
  );
  return { points, labels, minY, maxY, ticks };
}

// 화면 너비에만 반응하고, 데이터·눈금 수가 바뀌어도 카드 높이는 유지한다.
export function getProfitGraphHeight(width: number) {
  return Math.min((320 * 2) / 3, Math.max(180, (width * 2) / 3));
}

// 주어진 높이 안에서 격자 비율을 맞춘다. 날짜 간격이 과하게 좁아지지 않게 폭은 85% 이상 유지한다.
export function getProfitGraphPlotSize(
  availableWidth: number,
  labelCount: number,
  tickCount: number,
  height = 200,
) {
  const maxPlotHeight = height - 40;
  if (labelCount <= 1 || tickCount <= 1) {
    return { width: availableWidth, height: maxPlotHeight };
  }
  const columns = labelCount - 1;
  const rows = tickCount - 1;
  const width = Math.min(
    availableWidth,
    Math.max(availableWidth * 0.85, (maxPlotHeight / rows) * columns),
  );
  const plotHeight = Math.min(
    maxPlotHeight,
    Math.max(maxPlotHeight * 0.75, (width / columns) * rows),
  );
  return { width, height: plotHeight };
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
