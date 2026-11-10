import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

const source = await readFile(
  new URL(
    "../src/pages/invest/stats/utils/profitRateGraph.ts",
    import.meta.url,
  ),
  "utf8",
);
const { outputText } = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.ESNext,
    target: ts.ScriptTarget.ES2023,
  },
});
const {
  createProfitRateGraphModel,
  getRecentKstGraphLabels,
  formatProfitGraphRate,
  getProfitGraphLabelIndices,
} = await import(
  `data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`
);

const labels = [
  "2026-05-02",
  "2026-05-03",
  "2026-05-04",
  "2026-05-05",
  "2026-05-06",
  "2026-05-07",
  "2026-05-08",
];
const points = (values) =>
  values.map((value, index) => ({ label: labels[index], value }));

test("앞부분의 0%와 서버의 최근 정산일 기준 날짜를 그대로 유지한다", () => {
  const data = points([0, 0, 2.1, 4.5, 4.5, 9.3, 12.8]);
  const model = createProfitRateGraphModel(
    data,
    new Date("2026-10-27T00:00:00Z"),
  );
  assert.deepEqual(model.points, data);
  assert.deepEqual(model.labels, [
    "5/2",
    "5/3",
    "5/4",
    "5/5",
    "5/6",
    "5/7",
    "5/8",
  ]);
});

test("전체 0%는 빈 데이터가 아니고 7개 점을 유지한다", () => {
  const model = createProfitRateGraphModel(points([0, 0, 0, 0, 0, 0, 0]));
  assert.equal(model.points.length, 7);
  assert.deepEqual(
    model.points.map((point) => point.value),
    Array(7).fill(0),
  );
  assert.equal(model.minY, 0);
  assert.equal(model.maxY, 10);
});

test("빈 상태는 선·점 없이 KST 오늘 포함 직전 7일을 표시한다", () => {
  const model = createProfitRateGraphModel(
    [],
    new Date("2026-10-27T03:00:00Z"),
  );
  assert.deepEqual(model.points, []);
  assert.deepEqual(model.labels, [
    "10/21",
    "10/22",
    "10/23",
    "10/24",
    "10/25",
    "10/26",
    "10/27",
  ]);
  assert.deepEqual(model.ticks, [10, 7.5, 5, 2.5, 0]);
});

test("KST 자정 전후를 브라우저 타임존과 무관하게 계산한다", () => {
  assert.equal(
    getRecentKstGraphLabels(new Date("2026-10-26T14:59:59Z")).at(-1),
    "10/26",
  );
  assert.equal(
    getRecentKstGraphLabels(new Date("2026-10-26T15:00:00Z")).at(-1),
    "10/27",
  );
});

test("연말·윤년 경계의 날짜를 정상 계산한다", () => {
  assert.deepEqual(getRecentKstGraphLabels(new Date("2026-01-01T00:00:00Z")), [
    "12/26",
    "12/27",
    "12/28",
    "12/29",
    "12/30",
    "12/31",
    "1/1",
  ]);
  assert.deepEqual(getRecentKstGraphLabels(new Date("2028-03-01T00:00:00Z")), [
    "2/24",
    "2/25",
    "2/26",
    "2/27",
    "2/28",
    "2/29",
    "3/1",
  ]);
});

test("0% 한 점 및 일부 데이터만 있어도 임의의 날짜·점을 추가하지 않는다", () => {
  for (const values of [[0], [3], [0, 1, 2]]) {
    const data = points(values);
    const model = createProfitRateGraphModel(data);
    assert.equal(model.points.length, data.length);
    assert.equal(model.labels.length, data.length);
    assert.ok(model.maxY > model.minY);
  }
});

test("양수·음수·혼합·작은 값·큰 값은 원래 값과 0을 포함한 유한 범위를 갖는다", () => {
  for (const values of [
    [1, 5, 9],
    [-1, -5, -9],
    [-3, 0, 4],
    [0.1, -0.1],
    [-100, 1000, 6000],
    [-999999, 1000000],
  ]) {
    const model = createProfitRateGraphModel(points(values));
    assert.deepEqual(
      model.points.map((point) => point.value),
      values,
    );
    assert.ok(Number.isFinite(model.minY) && Number.isFinite(model.maxY));
    assert.ok(model.minY <= Math.min(...values, 0));
    assert.ok(model.maxY >= Math.max(...values, 0));
    assert.equal(model.ticks.length, 5);
  }
});

test("비유한 숫자만 제외하고 정상 0%는 유지한다", () => {
  const model = createProfitRateGraphModel(
    points([NaN, 0, Infinity, -Infinity, 2]),
  );
  assert.deepEqual(
    model.points.map((point) => point.value),
    [0, 2],
  );
  assert.deepEqual(model.labels, ["5/3", "5/6"]);
});

test("원본 배열·객체를 변경하지 않는다", () => {
  const data = Object.freeze(points([0, 1, -1]).map(Object.freeze));
  assert.doesNotThrow(() => createProfitRateGraphModel(data));
});

test("축 라벨은 부호·%를 유지하고 소수 최대 둘째 자리까지 표시한다", () => {
  assert.equal(formatProfitGraphRate(-2.5), "-2.5%");
  assert.equal(formatProfitGraphRate(0), "0%");
  assert.equal(formatProfitGraphRate(1.234), "1.23%");
  assert.equal(formatProfitGraphRate(8000), "8000%");
});

test("공간이 충분하면 날짜 라벨을 모두 표시한다", () => {
  assert.deepEqual(
    getProfitGraphLabelIndices(Array(7).fill(28), 221),
    [0, 1, 2, 3, 4, 5, 6],
  );
});

test("라벨이 겹치면 첫·마지막 날짜를 유지하며 중간 라벨을 줄인다", () => {
  const indices = getProfitGraphLabelIndices(Array(7).fill(36), 160);
  assert.equal(indices[0], 0);
  assert.equal(indices.at(-1), 6);
  assert.ok(indices.length < 7);
  for (let i = 1; i < indices.length; i++)
    assert.ok(((indices[i] - indices[i - 1]) / 6) * 160 >= 40);
  assert.deepEqual(getProfitGraphLabelIndices([28], 160), [0]);
});
