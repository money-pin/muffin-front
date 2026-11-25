import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

const source = await readFile(
  new URL("../src/lib/api.ts", import.meta.url),
  "utf8",
);
const { outputText } = ts.transpileModule(
  source.replace(
    "import.meta.env.VITE_API_BASE_URL",
    '"https://api.example.test"',
  ),
  {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2023,
    },
  },
);
function setup(t, handler) {
  const originalFetch = globalThis.fetch,
    originalWindow = globalThis.window;
  let token = "session-A";
  const calls = [],
    redirects = [],
    destinations = [];
  globalThis.window = {
    location: {
      pathname: "/my/settings",
      search: "",
      replace: (value) => redirects.push(value),
    },
  };
  globalThis.fetch = async (url, options) => {
    calls.push({ url, options });
    return handler(url, options, calls.length);
  };
  const exports = {};
  new Function("exports", "require", outputText)(exports, (name) => {
    if (name === "./auth")
      return {
        getAccessToken: () => token,
        saveAccessToken: (value) => (token = value),
        clearAccessToken: () => (token = null),
      };
    if (name === "./notificationNavigation")
      return {
        rememberNotificationDestination: (path) => destinations.push(path),
      };
    assert.fail(name);
  });
  t.after(() => {
    globalThis.fetch = originalFetch;
    globalThis.window = originalWindow;
  });
  return {
    ...exports,
    calls,
    redirects,
    destinations,
    setToken: (value) => (token = value),
    getToken: () => token,
  };
}
const reply = (status, code, result) =>
  new Response(
    JSON.stringify({
      isSuccess: status === 200,
      code,
      message: "test",
      ...(result === undefined ? {} : { result }),
    }),
    { status, headers: { "Content-Type": "application/json" } },
  );
test("device-token success accepts ApiResponse without a result field", async (t) => {
  const s = setup(t, () => reply(200, "COMMON_200_001"));
  const controller = new AbortController();
  const value = await s.apiRequest("/api/notifications/device-token", {
    method: "PUT",
    auth: true,
    body: { token: "AbCd0123", environment: "SANDBOX" },
    signal: controller.signal,
  });
  assert.equal(value, undefined);
  assert.equal(s.calls.length, 1);
  assert.equal(s.calls[0].options.headers.Authorization, "Bearer session-A");
  assert.deepEqual(JSON.parse(s.calls[0].options.body), {
    token: "AbCd0123",
    environment: "SANDBOX",
  });
  assert.equal(s.calls[0].options.signal, controller.signal);
});
test("AUTH_401_005 redirects once without refresh or a second PUT", async (t) => {
  const s = setup(t, () => reply(401, "AUTH_401_005"));
  await assert.rejects(
    () =>
      s.apiRequest("/api/notifications/device-token", {
        method: "PUT",
        auth: true,
      }),
    { code: "AUTH_401_005" },
  );
  assert.equal(s.calls.length, 1);
  assert.deepEqual(s.redirects, ["/login"]);
  assert.equal(s.getToken(), null);
});
test("AUTH_401_005 after ordinary refresh is still never retried again", async (t) => {
  const s = setup(t, (_url, _options, count) =>
    count === 1
      ? reply(401, "AUTH_401_001")
      : count === 2
        ? reply(200, "COMMON_200_001", { accessToken: "new-session" })
        : reply(401, "AUTH_401_005"),
  );
  await assert.rejects(
    () =>
      s.apiRequest("/api/notifications/device-token", {
        method: "PUT",
        auth: true,
      }),
    { code: "AUTH_401_005" },
  );
  assert.equal(s.calls.length, 3);
  assert.equal(
    s.calls.filter((c) => c.url.endsWith("/auth/token/refresh")).length,
    1,
  );
  assert.equal(s.getToken(), null);
});
test("late invalid-session response from A does not clear B's login", async (t) => {
  let resolve;
  const response = new Promise((r) => (resolve = r));
  const s = setup(t, () => response);
  const request = s.apiRequest("/api/notifications/device-token", {
    method: "PUT",
    auth: true,
  });
  s.setToken("session-B");
  resolve(reply(401, "AUTH_401_005"));
  await assert.rejects(() => request, { code: "AUTH_401_005" });
  assert.equal(s.getToken(), "session-B");
  assert.deepEqual(s.redirects, []);
  assert.equal(s.calls.length, 1);
});
test("ordinary expired access token refreshes and then succeeds", async (t) => {
  const s = setup(t, (_url, _options, count) =>
    count === 1
      ? reply(401, "AUTH_401_001")
      : count === 2
        ? reply(200, "COMMON_200_001", { accessToken: "renewed" })
        : reply(200, "COMMON_200_001"),
  );
  await s.apiRequest("/api/notifications/device-token", {
    method: "PUT",
    auth: true,
  });
  assert.equal(s.calls[2].options.headers.Authorization, "Bearer renewed");
  assert.deepEqual(s.redirects, []);
});

test("a remaining refresh cookie cannot restore login after local logout", async (t) => {
  const s = setup(t, (url) =>
    url.endsWith("/auth/token/refresh")
      ? reply(200, "COMMON_200_001", { accessToken: "must-not-be-saved" })
      : reply(401, "AUTH_401_001"),
  );
  s.setToken(null);
  await assert.rejects(
    () =>
      s.apiRequest("/api/notifications/device-token", {
        method: "PUT",
        auth: true,
      }),
    { code: "AUTH_401_001" },
  );
  assert.equal(s.calls.length, 1);
  assert.equal(s.getToken(), null);
});

test("late ordinary 401 from A never refreshes or replays a PUT under B", async (t) => {
  let resolve;
  const pending = new Promise((r) => {
    resolve = r;
  });
  const s = setup(t, () => pending);
  const request = s.apiRequest("/api/notifications/device-token", {
    method: "PUT",
    auth: true,
  });
  s.setToken("session-B");
  resolve(reply(401, "AUTH_401_001"));
  await assert.rejects(() => request, { code: "AUTH_SESSION_CHANGED" });
  assert.equal(s.calls.length, 1);
  assert.equal(s.getToken(), "session-B");
  assert.deepEqual(s.redirects, []);
});
test("400/500 responses do not trigger refresh or automatic retries", async (t) => {
  let status = 400;
  const s = setup(t, () =>
    reply(status, status === 400 ? "COMMON_400_002" : "COMMON_500_001"),
  );
  for (const value of [400, 500]) {
    status = value;
    await assert.rejects(() =>
      s.apiRequest("/api/notifications/device-token", {
        method: "PUT",
        auth: true,
      }),
    );
  }
  assert.equal(s.calls.length, 2);
  assert.deepEqual(s.redirects, []);
});

test("logout during refresh never restores the previous session", async (t) => {
  let resolveRefresh;
  const refreshReply = new Promise((resolve) => {
    resolveRefresh = resolve;
  });
  const s = setup(t, (_url, _options, count) =>
    count === 1 ? reply(401, "AUTH_401_001") : refreshReply,
  );
  const controller = new AbortController();
  const request = s.apiRequest("/api/notifications/device-token", {
    method: "PUT",
    auth: true,
    signal: controller.signal,
  });
  await new Promise((resolve) => setImmediate(resolve));
  s.setToken(null);
  controller.abort();
  resolveRefresh(
    reply(200, "COMMON_200_001", { accessToken: "old-session-renewed" }),
  );
  await assert.rejects(() => request);
  assert.equal(s.getToken(), null);
  assert.deepEqual(s.redirects, []);
});

test("an old refresh cannot overwrite a newer account or clear its refresh task", async (t) => {
  const deferred = () => {
    let resolve;
    const promise = new Promise((r) => {
      resolve = r;
    });
    return { promise, resolve };
  };
  const a = deferred(),
    b = deferred();
  let refreshes = 0;
  const s = setup(t, (url, options) => {
    if (url.endsWith("/auth/token/refresh"))
      return ++refreshes === 1 ? a.promise : b.promise;
    return options.headers.Authorization === "Bearer renewed-B"
      ? reply(200, "COMMON_200_001")
      : reply(401, "AUTH_401_001");
  });
  const first = s
    .apiRequest("/api/notifications/device-token", {
      method: "PUT",
      auth: true,
    })
    .catch((error) => error);
  await new Promise((resolve) => setImmediate(resolve));
  s.setToken("session-B");
  const second = s.apiRequest("/api/notifications/device-token", {
    method: "PUT",
    auth: true,
  });
  await new Promise((resolve) => setImmediate(resolve));
  a.resolve(reply(200, "COMMON_200_001", { accessToken: "renewed-A" }));
  await first;
  assert.equal(s.getToken(), "session-B");
  b.resolve(reply(200, "COMMON_200_001", { accessToken: "renewed-B" }));
  await second;
  assert.equal(s.getToken(), "renewed-B");
  assert.equal(refreshes, 2);
  assert.deepEqual(s.redirects, []);
});

test("simultaneous expired requests in one session still share one refresh", async (t) => {
  let refreshes = 0;
  const s = setup(t, (url, options) => {
    if (url.endsWith("/auth/token/refresh")) {
      refreshes++;
      return reply(200, "COMMON_200_001", { accessToken: "renewed" });
    }
    return options.headers.Authorization === "Bearer renewed"
      ? reply(200, "COMMON_200_001")
      : reply(401, "AUTH_401_001");
  });
  await Promise.all([
    s.apiRequest("/one", { auth: true }),
    s.apiRequest("/two", { auth: true }),
  ]);
  assert.equal(refreshes, 1);
});
