import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

// 기존 TypeScript 개발 의존성만 사용한다. 테스트 프레임워크를 추가하지 않는다.
async function loadPureModule(path) {
  const source = await readFile(new URL(path, import.meta.url), "utf8");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2023,
    },
  });
  return import(
    `data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`
  );
}

const selection = await loadPureModule(
  "../src/pages/invest/trade/utils/investmentSelection.ts",
);
const errors = await loadPureModule("../src/lib/errorMessages.ts");

test("예산이 0원으로 줄어도 3개에서 2개로만 감소한다", () => {
  assert.deepEqual(
    selection.updateInvestmentQuantity({ deposit: 3 }, "deposit", 2, 100000, 0),
    { deposit: 2 },
  );
});

test("예산이 줄었을 때 증가 시도가 기존 수량을 줄이지 않는다", () => {
  assert.deepEqual(
    selection.updateInvestmentQuantity({ deposit: 3 }, "deposit", 4, 100000, 0),
    { deposit: 3 },
  );
});

test("수량 0은 섹터를 제거한다", () => {
  assert.deepEqual(
    selection.updateInvestmentQuantity({ deposit: 1 }, "deposit", 0, 100000, 0),
    {},
  );
});

test("증가는 다른 섹터 투자금을 포함해 예산 상한을 지킨다", () => {
  assert.deepEqual(
    selection.updateInvestmentQuantity(
      { deposit: 1, gold: 2 },
      "deposit",
      10,
      100000,
      500000,
    ),
    { deposit: 3, gold: 2 },
  );
});

test("예산 0원과 누락·잘못된 예산을 구분한다", () => {
  assert.equal(
    selection.getInvestmentBudget({ remainingAmount: 0, totalAmount: 0 }),
    0,
  );
  assert.equal(
    selection.getInvestmentBudget({
      remainingAmount: 500000,
      totalAmount: 300000,
    }),
    800000,
  );
  for (const data of [
    null,
    {},
    { totalAmount: 300000 },
    { remainingAmount: NaN, totalAmount: 0 },
    { remainingAmount: -1, totalAmount: 0 },
    { remainingAmount: Infinity, totalAmount: 0 },
  ]) {
    assert.equal(selection.getInvestmentBudget(data), null);
  }
});

test("서버 섹터 순서와 무관하게 정확히 같은 수량만 저장 완료로 판단한다", () => {
  const request = {
    sectors: [
      { sectorCode: "GOLD", quantity: 2 },
      { sectorCode: "DEPOSIT", quantity: 1 },
    ],
  };
  assert.equal(
    selection.isSameInvestmentRequest(request, [
      { sectorCode: "DEPOSIT", quantity: 1 },
      { sectorCode: "GOLD", quantity: 2 },
    ]),
    true,
  );
  assert.equal(
    selection.isSameInvestmentRequest(request, [
      { sectorCode: "DEPOSIT", quantity: 1 },
      { sectorCode: "GOLD", quantity: 1 },
    ]),
    false,
  );
  assert.equal(selection.isSameInvestmentRequest(request, []), false);
  assert.equal(
    selection.isSameInvestmentRequest(request, [
      { sectorCode: "DEPOSIT", quantity: 1 },
      { sectorCode: "GOLD", quantity: 2 },
      { sectorCode: "USD", quantity: 1 },
    ]),
    false,
  );
});

test("미등록 오류의 fallback은 지정한 호출부에만 적용된다", () => {
  assert.equal(
    errors.getErrorMessage("INVESTMENT_400_999", undefined, {
      description: "서버 안내",
      action: "close",
    }).description,
    "서버 안내",
  );
  assert.equal(errors.getErrorMessage("INVESTMENT_400_999").action, "retry");
});

test("등록된 오류 정책과 화면별 override는 fallback보다 우선한다", () => {
  assert.equal(
    errors.getErrorMessage("INVESTMENT_400_001", undefined, {
      description: "서버 안내",
    }).description,
    "투자 가능 시간에 다시 이용해주세요.",
  );
  assert.equal(
    errors.getErrorMessage(
      "INVESTMENT_400_001",
      { description: "화면별 안내" },
      { description: "서버 안내" },
    ).description,
    "화면별 안내",
  );
});
