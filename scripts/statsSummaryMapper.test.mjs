import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

const source = await readFile(
  new URL("../src/pages/invest/stats/api/mappers.ts", import.meta.url),
  "utf8",
);
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS },
});
const exports = {};
// These cases exercise graph mapping only; fail if unrelated dependencies are used.
const unexpectedDependency = new Proxy(
  {},
  {
    get() {
      throw new Error("Unexpected dependency in graph mapping test");
    },
  },
);
new Function("exports", "require", outputText)(
  exports,
  () => unexpectedDependency,
);
const { mapStatsSummaryToStatsSummaryData } = exports;

function summary(investDate, values) {
  return {
    investDate,
    cumulativeProfitAmount: 0,
    cumulativeProfitRate: 0,
    graph: values.map((value, index) => ({
      date: `2026-11-${String(index + 4).padStart(2, "0")}`,
      cumulativeProfitRate: value,
    })),
    topSectors: [],
    investmentType: null,
  };
}

test("no settlement date ignores server-filled zero points", () => {
  const result = mapStatsSummaryToStatsSummaryData(
    summary(null, Array(7).fill(0)),
  );
  assert.equal(result.investDate, undefined);
  assert.deepEqual(result.trend, []);
});

test("settled history preserves all actual zero returns", () => {
  const response = summary("2026-11-10", Array(7).fill(0));
  const result = mapStatsSummaryToStatsSummaryData(response);
  assert.equal(result.trend.length, 7);
  assert.deepEqual(
    result.trend.map((point) => point.value),
    Array(7).fill(0),
  );
});

test("settled history preserves leading zeros, losses and offsetting returns", () => {
  const values = [0, 0, 2, -1, 0, 0, 0];
  const result = mapStatsSummaryToStatsSummaryData(
    summary("2026-11-10", values),
  );
  assert.deepEqual(
    result.trend.map((point) => point.value),
    values,
  );
});

test("an empty server graph remains empty", () => {
  for (const date of [null, "2026-11-10"]) {
    assert.deepEqual(
      mapStatsSummaryToStatsSummaryData(summary(date, [])).trend,
      [],
    );
  }
});
