import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";
import test from "node:test";
import ts from "typescript";
const code = ts.transpileModule(
  await readFile(
    new URL("../src/pages/home/settlementPopup.ts", import.meta.url),
    "utf8",
  ),
  { compilerOptions: { module: ts.ModuleKind.CommonJS } },
).outputText;
function setup() {
  const storage = new Map();
  const sandbox = {
    exports: {},
    localStorage: {
      getItem: (k) => storage.get(k),
      setItem: (k, v) => storage.set(k, v),
    },
  };
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox);
  return { ...sandbox.exports, sandbox };
}
test("ordinary entry keeps 10:00 KST reveal boundary", () => {
  const s = setup();
  assert.equal(
    s.shouldShowSettlementPopup(false, false, new Date("2026-11-22T00:59:59Z")),
    false,
  );
  assert.equal(
    s.shouldShowSettlementPopup(false, false, new Date("2026-11-22T01:00:00Z")),
    true,
  );
});
test("notification entry may show settled result before 10:00 KST", () => {
  assert.equal(
    setup().shouldShowSettlementPopup(
      false,
      true,
      new Date("2026-11-22T00:20:00Z"),
    ),
    true,
  );
});
test("seen settlement is never reopened by notification", () => {
  const s = setup();
  for (const source of [true, false])
    assert.equal(s.shouldShowSettlementPopup(true, source), false);
});
test("recorded date suppresses the same result but not a new settlement", () => {
  const s = setup();
  s.markSettlementSeen("2026.11.20");
  assert.equal(s.hasSeenSettlement("2026.11.20"), true);
  assert.equal(s.hasSeenSettlement("2026.11.23"), false);
});
test("blocked storage does not throw or repeat result during the same execution", () => {
  const s = setup();
  s.sandbox.localStorage = {
    getItem() {
      throw Error();
    },
    setItem() {
      throw Error();
    },
  };
  assert.equal(s.hasSeenSettlement("2026.11.20"), false);
  assert.doesNotThrow(() => s.markSettlementSeen("2026.11.20"));
  assert.equal(s.hasSeenSettlement("2026.11.20"), true);
});
