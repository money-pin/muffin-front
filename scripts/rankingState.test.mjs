import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

async function load(path, dependencies = {}) {
  const source = await readFile(new URL(path, import.meta.url), "utf8");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  });
  const exports = {};
  new Function("exports", "require", outputText)(exports, (name) => {
    assert.ok(name in dependencies, `Unexpected dependency: ${name}`);
    return dependencies[name];
  });
  return exports;
}

const { mapWeeklyRankingApiToData: map } = await load(
  "../src/pages/invest/ranking/api/mappers.ts",
  {
    "@/pages/invest/constants/sectorMeta": {
      getSectorMeta: (code) => ({ code, name: code, iconSrc: "icon.svg" }),
    },
  },
);
const { resolveRankingSelection: resolve } = await load(
  "../src/pages/invest/ranking/rankingSelection.ts",
);

function response(overrides = {}) {
  return {
    rankingStatus: "READY",
    weekStartDate: "2026-11-02",
    weekEndDate: "2026-11-08",
    weekOfYear: 45,
    weekLabel: "11월 1주차",
    myRank: null,
    top10: [
      {
        rank: 1,
        nickname: "user",
        profitAmount: 300,
        profitRate: 3,
        detail: {
          totalInvestment: 10000,
          sectors: [
            {
              sectorCode: "GOLD",
              sectorName: "금",
              profitAmount: 500,
              profitRate: 10,
              totalInvestment: 5000,
            },
            {
              sectorCode: "USD",
              sectorName: "달러",
              profitAmount: -200,
              profitRate: -4,
              totalInvestment: 5000,
            },
          ],
        },
      },
    ],
    ...overrides,
  };
}
const initialData = map(response());
const selection = { weekKey: initialData.weekKey, user: initialData.top10[0] };

test("mapping retains READY, CALCULATING and EMPTY independently of participation", () => {
  for (const rankingStatus of ["READY", "CALCULATING", "EMPTY"]) {
    const data = map(response({ rankingStatus, top10: [] }));
    assert.equal(data.status, rankingStatus);
    assert.deepEqual(data.myRank, { participated: false });
  }
});

test("participated rank and percentile are preserved", () => {
  assert.deepEqual(
    map(
      response({
        myRank: {
          participated: true,
          rank: 8,
          nickname: "me",
          topPercent: 12.5,
        },
      }),
    ).myRank,
    { participated: true, rank: 8, nickname: "me", percentile: 12.5 },
  );
});

test("list profit, server detail investment and sector sums agree for consistent responses", () => {
  const user = map(response()).top10[0];
  assert.equal(
    user.weeklyProfit,
    user.sectors.reduce((sum, sector) => sum + sector.profitAmount, 0),
  );
  assert.equal(
    user.totalInvestment,
    user.sectors.reduce((sum, sector) => sum + sector.investmentAmount, 0),
  );
  assert.equal(
    user.weeklyProfitRate,
    (user.weeklyProfit / user.totalInvestment) * 100,
  );
});

test("mapping never replaces server totals or rounded rate with sector calculations", () => {
  const raw = response();
  raw.top10[0].profitRate = 3.1;
  raw.top10[0].detail.totalInvestment = 12000;
  const user = map(raw).top10[0];
  assert.equal(user.weeklyProfitRate, 3.1);
  assert.equal(user.totalInvestment, 12000);
});

test("missing or null detail does not fabricate zero investment", () => {
  for (const detail of [undefined, null]) {
    const raw = response();
    raw.top10[0].detail = detail;
    const user = map(raw).top10[0];
    assert.equal(user.totalInvestment, undefined);
    assert.deepEqual(user.sectors, []);
    assert.equal(user.weeklyProfit, 300);
  }
});

test("same-week refetch preserves the selected settled ranking item", () => {
  const refetchedData = map(response());
  assert.notEqual(refetchedData.top10[0], selection.user);
  assert.equal(resolve(refetchedData, selection), selection.user);
  assert.equal(resolve(refetchedData, selection).weeklyProfit, 300);
});

test("new week closes selection even with the same display label and nickname", () => {
  assert.equal(
    resolve(map(response({ weekStartDate: "2027-11-02" })), selection),
    null,
  );
});

test("selection is cleared when data or selection is unavailable", () => {
  assert.equal(resolve(undefined, selection), null);
  assert.equal(resolve(map(response()), null), null);
});

test("selection does not resolve a user by nickname or rank", () => {
  const raw = response();
  raw.top10.push({ ...raw.top10[0], rank: 2 });
  const data = map(raw);
  const secondSelection = { weekKey: data.weekKey, user: data.top10[1] };
  assert.equal(resolve(data, secondSelection), data.top10[1]);
});
