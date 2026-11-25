import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

async function load(path, dependencies = {}, replacements = {}) {
  let source = await readFile(new URL(path, import.meta.url), "utf8");
  for (const [before, after] of Object.entries(replacements))
    source = source.replaceAll(before, after);
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2023,
    },
  });
  const exports = {};
  new Function("exports", "require", outputText)(exports, (name) => {
    assert.ok(name in dependencies, name);
    return dependencies[name];
  });
  return exports;
}
const registration = await load("../src/lib/push/deviceTokenRegistration.ts");
const navigation = await load("../src/lib/notificationNavigation.ts");
test("native configuration suppresses foreground presentation and simulator fixture matches bundle", async () => {
  const { default: config } = await load("../capacitor.config.ts");
  assert.deepEqual(config.plugins.PushNotifications.presentationOptions, []);
  const fixture = JSON.parse(
    await readFile(new URL("../ios/push-test.apns", import.meta.url), "utf8"),
  );
  assert.equal(fixture["Simulator Target Bundle"], config.appId);
  assert.equal(
    navigation.resolveNotificationDestination(
      fixture.deepLink,
      "https://muffin.ai.kr",
    ),
    "/quiz",
  );
});
const defer = () => {
  let resolve, reject;
  const promise = new Promise((a, b) => {
    resolve = a;
    reject = b;
  });
  return { promise, resolve, reject };
};
const flush = () => new Promise((resolve) => setImmediate(resolve));
function setup(t, overrides = {}) {
  let session = "session-A";
  let permission = "granted";
  const statuses = [],
    uploads = [];
  let registers = 0,
    prompts = 0;
  const deps = {
    environment: "SANDBOX",
    getAccessToken: () => session,
    checkPermissions: async () => ({ receive: permission }),
    requestPermissions: async () => {
      prompts++;
      permission = "granted";
      return { receive: permission };
    },
    register: async () => {
      registers++;
    },
    upload: async (...args) => {
      uploads.push(args);
    },
    onStatus: (value) => statuses.push(value),
    errorCode: (error) => error?.code,
    ...overrides,
  };
  const controller = registration.createDeviceTokenRegistration(deps);
  t.after(() => controller.dispose());
  return {
    controller,
    statuses,
    uploads,
    deps,
    get registers() {
      return registers;
    },
    get prompts() {
      return prompts;
    },
    setSession(value) {
      session = value;
    },
    setPermission(value) {
      permission = value;
    },
  };
}

test("APNs environment is explicit: invalid/missing/lowercase/whitespace never default", () => {
  for (const value of [
    undefined,
    "",
    "sandbox",
    "PRODUCTION ",
    "development",
    {},
  ])
    assert.equal(registration.parseApnsEnvironment(value), null);
  for (const value of ["SANDBOX", "PRODUCTION"])
    assert.equal(registration.parseApnsEnvironment(value), value);
});
test("token validation preserves the raw value and enforces 1..255 characters", () => {
  for (const value of [undefined, "", " token", "token ", "a".repeat(256)])
    assert.equal(registration.isValidApnsToken(value), false);
  assert.equal(registration.isValidApnsToken("AbCd0123"), true);
  assert.equal(registration.isValidApnsToken("a".repeat(255)), true);
});
test("missing environment blocks both OS registration and token upload", async (t) => {
  const s = setup(t, { environment: null });
  await s.controller.refresh(true);
  await s.controller.receiveToken("token");
  assert.equal(s.registers, 0);
  assert.equal(s.uploads.length, 0);
  assert.equal(s.statuses.at(-1), "configuration-error");
});
test("startup checks existing permission without prompting; first completed home may ask", async (t) => {
  const s = setup(t);
  s.setPermission("prompt");
  await s.controller.refresh();
  assert.equal(s.prompts, 0);
  assert.equal(s.registers, 0);
  await s.controller.refresh(true);
  assert.equal(s.prompts, 1);
  assert.equal(s.registers, 1);
  await s.controller.receiveToken("AbCd0123");
  assert.equal(s.uploads[0][0], "AbCd0123");
  assert.equal(s.uploads[0][1], "SANDBOX");
  assert.equal(s.statuses.at(-1), "ready");
});
test("denied permission is not automatically requested again", async (t) => {
  const s = setup(t);
  s.setPermission("denied");
  await s.controller.refresh(true);
  await s.controller.refresh(true);
  assert.equal(s.prompts, 0);
  assert.equal(s.registers, 0);
  assert.equal(s.statuses.at(-1), "denied");
});
test("logged-out startup never uploads or registers", async (t) => {
  const s = setup(t);
  s.setSession(null);
  await s.controller.refresh(true);
  await s.controller.receiveToken("token");
  assert.equal(s.registers, 0);
  assert.equal(s.uploads.length, 0);
  assert.equal(s.statuses.at(-1), "signed-out");
});
test("same token is uploaded on later startup/login rather than permanently cached", async (t) => {
  const s = setup(t);
  for (let i = 0; i < 2; i++) {
    await s.controller.refresh();
    await s.controller.receiveToken("token");
  }
  assert.equal(s.registers, 2);
  assert.equal(s.uploads.length, 2);
});
test("concurrent identical registration events share one in-flight PUT", async (t) => {
  const pending = defer();
  let calls = 0;
  const s = setup(t, {
    upload: () => {
      calls++;
      return pending.promise;
    },
  });
  const first = s.controller.receiveToken("token");
  await s.controller.receiveToken("token");
  assert.equal(calls, 1);
  pending.resolve();
  await first;
});
test("APNs token rotation aborts old upload and sends the new raw token", async (t) => {
  const first = defer();
  const seen = [];
  const s = setup(t, {
    upload: (...args) => {
      seen.push(args);
      return seen.length === 1 ? first.promise : Promise.resolve();
    },
  });
  const old = s.controller.receiveToken("old");
  await s.controller.receiveToken("new");
  assert.equal(seen[0][2].aborted, true);
  assert.equal(seen[1][0], "new");
  first.resolve();
  await old;
  assert.equal(s.statuses.at(-1), "ready");
});
test("logout aborts pending upload and ignores its late success", async (t) => {
  const pending = defer();
  let signal;
  const s = setup(t, {
    upload: (_a, _b, value) => {
      signal = value;
      return pending.promise;
    },
  });
  const request = s.controller.receiveToken("token");
  s.setSession(null);
  s.controller.sessionChanged();
  assert.equal(signal.aborted, true);
  pending.resolve();
  await request;
  assert.equal(s.statuses.at(-1), "signed-out");
});
test("account switch cancels A and binds subsequent token registration to B", async (t) => {
  const pending = defer();
  const seen = [];
  let s;
  s = setup(t, {
    upload: () => {
      seen.push(s.deps.getAccessToken());
      return seen.length === 1 ? pending.promise : Promise.resolve();
    },
  });
  const first = s.controller.receiveToken("same-device");
  s.setSession("session-B");
  s.controller.sessionChanged();
  await flush();
  await s.controller.receiveToken("same-device");
  pending.reject({ code: "AUTH_401_005" });
  await first;
  assert.deepEqual(seen, ["session-A", "session-B"]);
  assert.equal(s.statuses.at(-1), "ready");
});
test("AUTH_401_005 blocks re-registration for the same session but allows a new login", async (t) => {
  let calls = 0;
  const s = setup(t, {
    upload: async () => {
      calls++;
      throw { code: "AUTH_401_005" };
    },
  });
  await s.controller.receiveToken("token");
  await s.controller.refresh();
  await s.controller.receiveToken("token");
  assert.equal(calls, 1);
  assert.equal(s.registers, 0);
  s.setSession("new-session");
  s.controller.sessionChanged();
  await flush();
  await s.controller.receiveToken("token");
  assert.equal(calls, 2);
});
test("upload failure does not loop; explicit later registration can recover", async (t) => {
  let fail = true,
    calls = 0;
  const s = setup(t, {
    upload: async () => {
      calls++;
      if (fail) throw Error("offline");
    },
  });
  await s.controller.receiveToken("token");
  await flush();
  assert.equal(calls, 1);
  assert.equal(s.statuses.at(-1), "error");
  fail = false;
  await s.controller.receiveToken("token");
  assert.equal(s.statuses.at(-1), "ready");
});
test("registration watchdog ends a stuck pending UI", async (t) => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  const s = setup(t);
  await s.controller.refresh();
  t.mock.timers.tick(20_000);
  assert.equal(s.statuses.at(-1), "error");
});

test("hung upload times out even if native transport ignores abort; late success is ignored", async (t) => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  const pending = defer();
  let signal;
  const s = setup(t, {
    upload: (_token, _environment, value) => {
      signal = value;
      return pending.promise;
    },
  });
  const first = s.controller.receiveToken("token");
  t.mock.timers.tick(20_000);
  await first;
  assert.equal(signal.aborted, true);
  assert.equal(s.statuses.at(-1), "error");
  s.deps.upload = async () => {};
  await s.controller.receiveToken("token");
  assert.equal(s.statuses.at(-1), "ready");
  const count = s.statuses.length;
  pending.resolve();
  await flush();
  assert.equal(s.statuses.length, count);
});
test("permission result arriving after logout cannot register", async (t) => {
  const pending = defer();
  const s = setup(t, { checkPermissions: () => pending.promise });
  const first = s.controller.refresh();
  s.setSession(null);
  s.controller.sessionChanged();
  pending.resolve({ receive: "granted" });
  await first;
  assert.equal(s.registers, 0);
  assert.equal(s.statuses.at(-1), "signed-out");
});
test("concurrent permission actions ask the OS only once", async (t) => {
  const pending = defer();
  let prompts = 0;
  const s = setup(t, {
    checkPermissions: async () => ({ receive: "prompt" }),
    requestPermissions: () => {
      prompts++;
      return pending.promise;
    },
  });
  const first = s.controller.refresh(true);
  await flush();
  await s.controller.refresh(true);
  assert.equal(prompts, 1);
  pending.resolve({ receive: "denied" });
  await first;
});

test("logout pause cancels upload and blocks registration until failure recovery", async (t) => {
  const pending = defer();
  let signal;
  const s = setup(t, {
    upload: (_token, _env, value) => {
      signal = value;
      return pending.promise;
    },
  });
  const upload = s.controller.receiveToken("token");
  const resume = s.controller.pause();
  await upload;
  assert.equal(signal.aborted, true);
  await s.controller.refresh(true);
  await s.controller.receiveToken("token");
  assert.equal(s.registers, 0);
  resume();
  await flush();
  assert.equal(s.registers, 1);
  s.deps.upload = async () => {};
  await s.controller.receiveToken("token");
  assert.equal(s.statuses.at(-1), "ready");
  pending.resolve();
});
test("successful logout unpauses into signed-out state; old resume never registers", async (t) => {
  const s = setup(t);
  const resume = s.controller.pause();
  s.setSession(null);
  s.controller.sessionChanged();
  await flush();
  resume();
  assert.equal(s.registers, 0);
  assert.equal(s.statuses.at(-1), "signed-out");
});
test("session changes remain paused until logout finishes; resume registers the current login", async (t) => {
  const s = setup(t);
  const resume = s.controller.pause();
  s.setSession("B");
  s.controller.sessionChanged();
  await flush();
  assert.equal(s.registers, 0);
  resume();
  await flush();
  assert.equal(s.registers, 1);
});

class FakeApiError extends Error {
  constructor(message, code) {
    super(message);
    this.code = code;
  }
}
async function runtime(native = true, failListener = false) {
  const saved = { window: globalThis.window, document: globalThis.document };
  const win = new EventTarget();
  win.location = { origin: "https://muffin.ai.kr" };
  const doc = new EventTarget();
  doc.visibilityState = "visible";
  globalThis.window = win;
  globalThis.document = doc;
  const callbacks = new Map();
  const removed = [];
  const calls = [];
  let session = "A";
  const plugin = {
    addListener: async (name, cb) => {
      calls.push(name);
      if (failListener && name === "registration") throw Error();
      callbacks.set(name, cb);
      return { remove: async () => removed.push(name) };
    },
    checkPermissions: async () => {
      calls.push("check");
      return { receive: "prompt" };
    },
    requestPermissions: async () => ({ receive: "denied" }),
    register: async () => calls.push("register"),
  };
  const module = await load(
    "../src/lib/push/iosPush.ts",
    {
      "@capacitor/core": {
        Capacitor: {
          isNativePlatform: () => native,
          getPlatform: () => (native ? "ios" : "web"),
        },
      },
      "@capacitor/push-notifications": { PushNotifications: plugin },
      "@/lib/auth": {
        AUTH_SESSION_CHANGED_EVENT: "session",
        getAccessToken: () => session,
      },
      "@/lib/api": { ApiError: FakeApiError },
      "@/lib/notificationNavigation": navigation,
      "./deviceTokenApi": { registerDeviceToken: async () => {} },
      "./deviceTokenRegistration": registration,
    },
    { "import.meta.env.VITE_APNS_ENVIRONMENT": "'SANDBOX'" },
  );
  return {
    module,
    calls,
    callbacks,
    removed,
    win,
    doc,
    setSession: (value) => (session = value),
    restore: () => {
      globalThis.window = saved.window;
      globalThis.document = saved.document;
    },
  };
}
test("web initialization and home calls do not invoke native permission APIs", async () => {
  const r = await runtime(false);
  try {
    const dispose = r.module.initializeIosPush(() => assert.fail());
    await r.module.requestIosPushPermission();
    dispose();
    assert.deepEqual(r.calls, []);
  } finally {
    r.restore();
  }
});
test("native listeners precede registration; foreground/dismiss/malicious links never navigate", async () => {
  const r = await runtime();
  const paths = [];
  const dispose = r.module.initializeIosPush((path) => paths.push(path));
  try {
    await flush();
    assert.deepEqual(r.calls.slice(0, 4), [
      "pushNotificationActionPerformed",
      "registration",
      "registrationError",
      "pushNotificationReceived",
    ]);
    r.callbacks.get("pushNotificationReceived")({
      data: { deepLink: "muffin://quiz/today" },
    });
    const action = r.callbacks.get("pushNotificationActionPerformed");
    action({
      actionId: "dismiss",
      notification: { data: { deepLink: "muffin://quiz/today" } },
    });
    action({
      actionId: "tap",
      notification: { data: { deepLink: "https://evil.example" } },
    });
    assert.equal(paths.length, 0);
    action({
      actionId: "tap",
      notification: { data: { deepLink: "muffin://quiz/today" } },
    });
    assert.equal(paths[0], "/notifications/open?url=%2Fquiz");
    r.win.dispatchEvent(new Event("session"));
    await flush();
    assert.equal(r.calls.filter((x) => x === "check").length, 2);
  } finally {
    dispose();
    assert.equal(r.removed.length, 4);
    r.restore();
  }
});
test("partial listener initialization failure removes only this module's listeners", async () => {
  const r = await runtime(true, true);
  try {
    r.module.initializeIosPush(() => {});
    await flush();
    assert.equal(r.module.getIosPushStatus(), "error");
    assert.deepEqual(r.removed, ["pushNotificationActionPerformed"]);
  } finally {
    r.restore();
  }
});
