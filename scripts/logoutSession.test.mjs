import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

const source = await readFile(
  new URL("../src/lib/logoutSession.ts", import.meta.url),
  "utf8",
);
const { outputText } = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2023,
  },
});

test("auth session revision distinguishes token refresh from new login/logout", async () => {
  const authSource = await readFile(
    new URL("../src/lib/auth.ts", import.meta.url),
    "utf8",
  );
  const compiled = ts.transpileModule(authSource, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2023,
    },
  }).outputText;
  const values = new Map();
  const storage = {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key),
  };
  const win = new EventTarget();
  const auth = {};
  new Function("exports", "localStorage", "window", compiled)(
    auth,
    storage,
    win,
  );
  let events = 0;
  win.addEventListener(auth.AUTH_SESSION_CHANGED_EVENT, () => events++);
  auth.saveAccessToken("A");
  const revision = auth.getAuthSessionRevision();
  auth.saveAccessToken("A-renewed", { preserveSession: true });
  assert.equal(auth.getAuthSessionRevision(), revision);
  assert.equal(auth.getAccessToken(), "A-renewed");
  auth.clearAccessToken();
  assert.notEqual(auth.getAuthSessionRevision(), revision);
  auth.saveAccessToken("B");
  assert.notEqual(auth.getAuthSessionRevision(), revision);
  assert.equal(events, 4);
});
function setup(logout) {
  let token = "session-A";
  let revision = 0;
  const calls = [];
  const exports = {};
  new Function("exports", "require", outputText)(exports, (name) => {
    if (name === "./authApi")
      return {
        logout: (signal) => {
          calls.push("request");
          return logout(signal);
        },
      };
    if (name === "./auth")
      return {
        getAccessToken: () => token,
        getAuthSessionRevision: () => revision,
        clearAccessToken: () => {
          calls.push("clear-token");
          token = null;
        },
      };
    if (name === "./notificationNavigation")
      return {
        clearNotificationDestination: () => calls.push("clear-destination"),
      };
    if (name === "./push/iosPush")
      return {
        pauseIosPushRegistration: () => {
          calls.push("pause");
          return () => calls.push("resume");
        },
      };
    assert.fail(name);
  });
  return {
    ...exports,
    calls,
    getToken: () => token,
    setToken: (value, refreshed = false) => {
      token = value;
      if (!refreshed) revision++;
    },
  };
}
const defer = () => {
  let resolve, reject;
  const promise = new Promise((a, b) => {
    resolve = a;
    reject = b;
  });
  return { promise, resolve, reject };
};

test("successful server logout clears local session only after acknowledgement", async () => {
  const pending = defer();
  const s = setup(() => pending.promise);
  const request = s.logoutSession();
  assert.equal(s.getToken(), "session-A");
  assert.deepEqual(s.calls, ["pause", "request"]);
  pending.resolve();
  assert.deepEqual(await request, { loggedOut: true, serverRevoked: true });
  assert.deepEqual(s.calls, [
    "pause",
    "request",
    "clear-destination",
    "clear-token",
    "resume",
  ]);
  assert.equal(s.getToken(), null);
});
test("offline/500 failure still clears local login and destination without a retry prompt", async () => {
  const s = setup(async () => {
    throw Error("offline");
  });
  assert.deepEqual(await s.logoutSession(), {
    loggedOut: true,
    serverRevoked: false,
  });
  assert.equal(s.getToken(), null);
  assert.deepEqual(s.calls, [
    "pause",
    "request",
    "clear-destination",
    "clear-token",
    "resume",
  ]);
});
test("repeated logout clicks share one in-flight POST", async () => {
  const pending = defer();
  const s = setup(() => pending.promise);
  const first = s.logoutSession(),
    second = s.logoutSession();
  assert.equal(first, second);
  assert.equal(s.calls.filter((c) => c === "request").length, 1);
  pending.resolve();
  await first;
});
test("a late successful logout cannot clear a new account", async () => {
  const pending = defer();
  const s = setup(() => pending.promise);
  const request = s.logoutSession();
  s.setToken("session-B");
  pending.resolve();
  assert.deepEqual(await request, { loggedOut: false, serverRevoked: true });
  assert.equal(s.getToken(), "session-B");
  assert.deepEqual(s.calls, ["pause", "request", "resume"]);
});

test("access token refresh during logout is still the same session", async () => {
  const pending = defer();
  const s = setup(() => pending.promise);
  const first = s.logoutSession();
  s.setToken("renewed-A", true);
  assert.equal(s.logoutSession(), first);
  pending.resolve();
  assert.deepEqual(await first, { loggedOut: true, serverRevoked: true });
  assert.equal(s.getToken(), null);
});
test("hung native logout finishes local logout within 3 seconds and ignores late success", async (t) => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  const pending = defer();
  let signal;
  const s = setup((value) => {
    signal = value;
    return pending.promise;
  });
  const request = s.logoutSession();
  t.mock.timers.tick(3_000);
  assert.deepEqual(await request, { loggedOut: true, serverRevoked: false });
  assert.equal(signal.aborted, true);
  assert.equal(s.getToken(), null);
  s.setToken("session-B");
  pending.resolve();
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(s.getToken(), "session-B");
  assert.deepEqual(s.calls, [
    "pause",
    "request",
    "clear-destination",
    "clear-token",
    "resume",
  ]);
});
