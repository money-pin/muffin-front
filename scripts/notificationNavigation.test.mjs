import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";
import ts from "typescript";
const source = await readFile(
  new URL("../src/lib/notificationNavigation.ts", import.meta.url),
  "utf8",
);
const code = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2023,
  },
}).outputText;
function setup() {
  const values = new Map();
  let now = 100000000;
  const sandbox = {
    exports: {},
    URL,
    Date: class extends Date {
      static now() {
        return now;
      }
    },
    window: { location: { origin: "http://localhost:5173" } },
    sessionStorage: {
      getItem: (key) => values.get(key) ?? null,
      setItem: (key, value) => values.set(key, value),
      removeItem: (key) => values.delete(key),
    },
  };
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox);
  return { ...sandbox.exports, values, sandbox, advance: (ms) => (now += ms) };
}
test("current and legacy notification links map to existing application routes", () => {
  const { resolveNotificationDestination: resolve } = setup();
  for (const [input, expected] of [
    [
      "muffin://briefing/2026-11-22",
      "/briefing?date=2026-11-22&from=notification",
    ],
    [
      "muffin://briefing?date=2026-11-22",
      "/briefing?date=2026-11-22&from=notification",
    ],
    ["muffin://quiz/today", "/quiz"],
    ["muffin://quiz", "/quiz"],
    ["muffin://ranking", "/invest/ranking"],
    ["muffin://invest/ranking", "/invest/ranking"],
    ["muffin://news/123", "/news/123?from=notification"],
    ["muffin://home?popup=settlement", "/home?popup=settlement"],
    ["/quiz", "/quiz"],
    ["http://localhost:5173/news/123", "/news/123?from=notification"],
  ])
    assert.equal(resolve(input, "http://localhost:5173"), expected, input);
});
test("external URLs, credentials, traversal, encoded separators, control characters and auth routes are rejected", () => {
  const { resolveNotificationDestination: resolve } = setup();
  for (const value of [
    null,
    {},
    "",
    " /quiz",
    "/quiz\n",
    "https://evil.example/quiz",
    "javascript:alert(1)",
    "data:text/html,a",
    "//evil.example/quiz",
    "muffin://user:password@quiz",
    "muffin://quiz:99",
    "/news/../quiz",
    "/news/%2e%2e/quiz",
    "/news%2f123",
    "\\quiz",
    "/login",
    "/onboarding",
    "/notifications/open",
    "muffin:quiz",
    "/quiz#anything",
    "/news/0",
    "/news/999999999999999999999999",
  ]) {
    assert.equal(
      resolve(value, "http://localhost:5173"),
      null,
      JSON.stringify(value),
    );
  }
});
test("briefing dates must exist in the calendar including leap years", () => {
  const { resolveNotificationDestination: resolve } = setup();
  for (const date of [
    "2026-02-29",
    "2026-13-01",
    "2026-04-31",
    "2026-1-01",
    "invalid",
  ])
    assert.equal(
      resolve(`/briefing?date=${date}`, "https://muffin.ai.kr"),
      null,
      date,
    );
  assert.equal(
    resolve("/briefing?date=2028-02-29", "https://muffin.ai.kr"),
    "/briefing?date=2028-02-29&from=notification",
  );
});
test("unknown query parameters never enter the saved destination", () => {
  const s = setup();
  s.rememberNotificationDestination("/quiz?returnTo=https://evil.example");
  assert.equal(s.consumeNotificationDestination(), "/quiz");
});
test("onboarding has priority and successful completion consumes destination once", () => {
  const s = setup();
  s.rememberNotificationDestination("muffin://news/123");
  assert.equal(s.resolvePostLoginDestination("/onboarding"), "/onboarding");
  assert.equal(
    s.resolvePostLoginDestination("/home"),
    "/news/123?from=notification",
  );
  assert.equal(s.resolvePostLoginDestination("/home"), "/home");
});
test("newest valid click replaces earlier destination; unrelated paths do not overwrite it", () => {
  const s = setup();
  s.rememberNotificationDestination("/quiz");
  s.rememberNotificationDestination("/invest/ranking");
  s.rememberNotificationDestination("/auth/google/callback");
  assert.equal(s.consumeNotificationDestination(), "/invest/ranking");
});
test("expired and future-dated destinations are discarded", () => {
  for (const change of [1800001, -1]) {
    const s = setup();
    s.rememberNotificationDestination("/quiz");
    s.advance(change);
    assert.equal(s.consumeNotificationDestination(), null);
    assert.equal(s.values.size, 0);
  }
});
test("malformed and tampered storage cannot trigger external navigation", () => {
  for (const raw of [
    "not-json",
    "null",
    JSON.stringify({ savedAt: 100000000, path: "https://evil.example" }),
    JSON.stringify({ path: "/quiz" }),
  ]) {
    const s = setup();
    s.values.set("muffin:notificationDestination", raw);
    assert.equal(s.consumeNotificationDestination(), null);
    assert.equal(s.values.size, 0);
  }
});
test("explicit clear removes previous account destination", () => {
  const s = setup();
  s.rememberNotificationDestination("/quiz");
  s.clearNotificationDestination();
  assert.equal(s.resolvePostLoginDestination("/home"), "/home");
});
test("unavailable session storage never blocks login", () => {
  const s = setup();
  s.sandbox.sessionStorage = {
    getItem() {
      throw Error();
    },
    setItem() {
      throw Error();
    },
    removeItem() {
      throw Error();
    },
  };
  assert.doesNotThrow(() => s.rememberNotificationDestination("/quiz"));
  assert.equal(s.resolvePostLoginDestination("/home"), "/home");
});
