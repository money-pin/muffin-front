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
  return { ...sandbox.exports, sandbox, storage };
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
  s.markSettlementSeen("1024", "2026.11.20");
  assert.equal(s.hasSeenSettlement("1024", "2026.11.20"), true);
  assert.equal(s.hasSeenSettlement("1024", "2026.11.23"), false);
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
  assert.equal(s.hasSeenSettlement("1024", "2026.11.20"), false);
  assert.doesNotThrow(() => s.markSettlementSeen("1024", "2026.11.20"));
  assert.equal(s.hasSeenSettlement("1024", "2026.11.20"), true);
  assert.equal(s.hasSeenSettlement("2048", "2026.11.20"), false);
});

test("accounts have independent seen dates and legacy global state is ignored", () => {
  const s = setup();
  s.storage.set("muffin:investResultSeenDate", "2026.11.20");
  assert.equal(s.hasSeenSettlement("1024", "2026.11.20"), false);
  s.markSettlementSeen("1024", "2026.11.20");
  assert.equal(s.hasSeenSettlement("2048", "2026.11.20"), false);
  s.markSettlementSeen("2048", "2026.11.23");
  assert.equal(s.hasSeenSettlement("1024", "2026.11.20"), true);
  assert.equal(s.hasSeenSettlement("2048", "2026.11.23"), true);
  assert.equal(s.storage.get("muffin:investResultSeenDate:1024"), "2026.11.20");
});

test("seen date survives a new execution for the same account only", () => {
  const first = setup();
  first.markSettlementSeen("1024", "2026.11.20");
  const next = setup();
  for (const [key, value] of first.storage) next.storage.set(key, value);
  assert.equal(next.hasSeenSettlement("1024", "2026.11.20"), true);
  assert.equal(next.hasSeenSettlement("2048", "2026.11.20"), false);
});

const authCode = ts.transpileModule(
  await readFile(new URL("../src/lib/auth.ts", import.meta.url), "utf8"),
  { compilerOptions: { module: ts.ModuleKind.CommonJS } },
).outputText;
const queryCode = ts.transpileModule(
  await readFile(
    new URL("../src/pages/invest/settlementResultQueries.ts", import.meta.url),
    "utf8",
  ),
  { compilerOptions: { module: ts.ModuleKind.CommonJS } },
).outputText;

test("settlement cache is isolated and a late response cannot cross login sessions", async () => {
  let accountId = "1024";
  let revision = 1;
  let finish;
  const sandbox = {
    exports: {},
    require: (id) => {
      if (id === "@tanstack/react-query")
        return { useQuery: (options) => options };
      if (id === "@/lib/auth")
        return {
          getAccountId: () => accountId,
          getAuthSessionRevision: () => revision,
        };
      if (id === "@/pages/invest/settlementResultApi")
        return {
          getSettlementResult: () =>
            new Promise((resolve) => {
              finish = resolve;
            }),
        };
      throw new Error(id);
    },
  };
  vm.runInNewContext(queryCode, sandbox);
  const useQuery = sandbox.exports.useSettlementResultQuery;
  const first = useQuery(accountId);
  const pending = first.queryFn();
  accountId = "2048";
  revision++;
  const second = useQuery(accountId);
  assert.notDeepEqual(first.queryKey, second.queryKey);
  finish({ result: { date: "2026.11.20" } });
  await assert.rejects(pending, /session changed/);
  accountId = "1024";
  revision++;
  assert.notDeepEqual(first.queryKey, useQuery(accountId).queryKey);
  assert.equal(useQuery(null).enabled, false);
  await assert.rejects(first.queryFn(), /session changed/);
  const current = useQuery(accountId);
  const success = current.queryFn();
  finish({ result: { date: "2026.11.23" } });
  assert.equal((await success).result.date, "2026.11.23");
});

test("account identity uses Muffin JWT sub, survives refresh, clears on logout", () => {
  const storage = new Map();
  const sandbox = {
    exports: {},
    atob,
    localStorage: {
      getItem: (k) => storage.get(k) ?? null,
      setItem: (k, v) => storage.set(k, v),
      removeItem: (k) => storage.delete(k),
    },
  };
  vm.runInNewContext(authCode, sandbox);
  const auth = sandbox.exports;
  const jwt = (claims) =>
    `header.${Buffer.from(JSON.stringify(claims)).toString("base64url")}.signature`;
  assert.equal(auth.getAccountId(), null);
  auth.saveAccessToken(jwt({ sub: "1024", sessionId: "a" }));
  assert.equal(auth.getAccountId(), "1024");
  auth.saveAccessToken(jwt({ sub: "1024", sessionId: "b" }), {
    preserveSession: true,
  });
  assert.equal(auth.getAccountId(), "1024");
  auth.saveAccessToken(jwt({ sub: "2048" }));
  assert.equal(auth.getAccountId(), "2048");
  auth.clearAccessToken();
  assert.equal(auth.getAccountId(), null);
  for (const token of [
    "invalid",
    "a.!!!.c",
    jwt({}),
    jwt({ sub: 1024 }),
    jwt({ sub: "" }),
    jwt({ sub: "../bad" }),
  ]) {
    auth.saveAccessToken(token);
    assert.equal(auth.getAccountId(), null);
  }
});
