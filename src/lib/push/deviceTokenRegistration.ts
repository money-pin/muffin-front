export type ApnsEnvironment = "SANDBOX" | "PRODUCTION";
export type IosPushStatus =
  | "checking"
  | "prompt"
  | "denied"
  | "signed-out"
  | "registering"
  | "ready"
  | "error"
  | "configuration-error";

export function parseApnsEnvironment(value: unknown): ApnsEnvironment | null {
  return value === "SANDBOX" || value === "PRODUCTION" ? value : null;
}

export function isValidApnsToken(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value.length > 0 &&
    value.length <= 255 &&
    value.trim() === value
  );
}

interface Dependencies {
  environment: ApnsEnvironment | null;
  getAccessToken: () => string | null;
  checkPermissions: () => Promise<{ receive: string }>;
  requestPermissions: () => Promise<{ receive: string }>;
  register: () => Promise<void>;
  upload: (
    token: string,
    environment: ApnsEnvironment,
    signal: AbortSignal,
  ) => Promise<void>;
  onStatus: (status: IosPushStatus) => void;
  errorCode: (error: unknown) => string | undefined;
}

// APNs 토큰은 메모리에만 유지한다. 성공 값을 영구 캐싱하지 않아 앱 실행·로그인마다 PUT한다.
export function createDeviceTokenRegistration(deps: Dependencies) {
  let disposed = false;
  let permissionVersion = 0;
  let uploadVersion = 0;
  let uploading: AbortController | null = null;
  let uploadKey: string | null = null;
  let blockedSession: string | null = null;
  let requestInProgress = false;
  let paused = false;
  let pauseVersion = 0;
  let watchdog: ReturnType<typeof setTimeout> | undefined;
  const clearWatchdog = () => {
    clearTimeout(watchdog);
    watchdog = undefined;
  };
  const status = (value: IosPushStatus) => {
    if (!disposed) deps.onStatus(value);
  };
  const stopUpload = () => {
    uploadVersion++;
    uploading?.abort();
    uploading = null;
    uploadKey = null;
  };

  const receiveToken = async (token: unknown) => {
    if (disposed || paused) return;
    clearWatchdog();
    const session = deps.getAccessToken();
    if (!session) {
      status("signed-out");
      return;
    }
    if (session === blockedSession) return;
    if (!deps.environment) {
      status("configuration-error");
      return;
    }
    if (!isValidApnsToken(token)) {
      status("error");
      return;
    }
    const key = `${session}\0${token}`;
    if (uploadKey === key) return;
    stopUpload();
    const version = uploadVersion;
    const controller = new AbortController();
    uploading = controller;
    uploadKey = key;
    status("registering");
    let timedOut = false;
    let timeout: ReturnType<typeof setTimeout> | undefined;
    let onAbort: (() => void) | undefined;
    try {
      // 네이티브 HTTP 브리지는 AbortSignal을 무시할 수도 있어 UI 대기도 별도로 끝낸다.
      const interrupted = new Promise<never>((_resolve, reject) => {
        onAbort = () => reject(new Error("Device token upload interrupted"));
        controller.signal.addEventListener("abort", onAbort, { once: true });
        timeout = setTimeout(() => {
          timedOut = true;
          controller.abort();
        }, 20_000);
      });
      await Promise.race([
        deps.upload(token, deps.environment, controller.signal),
        interrupted,
      ]);
      if (
        !disposed &&
        version === uploadVersion &&
        session === deps.getAccessToken()
      )
        status("ready");
    } catch (error) {
      if (
        disposed ||
        (controller.signal.aborted && !timedOut) ||
        version !== uploadVersion ||
        session !== deps.getAccessToken()
      )
        return;
      if (deps.errorCode(error) === "AUTH_401_005") blockedSession = session;
      // 자동 재시도하지 않는다. 다음 실행·로그인 또는 명시적인 재확인에서 등록한다.
      status("error");
    } finally {
      clearTimeout(timeout);
      if (onAbort) controller.signal.removeEventListener("abort", onAbort);
      if (version === uploadVersion) {
        uploading = null;
        uploadKey = null;
      }
    }
  };

  const refresh = async (askPermission = false) => {
    if (disposed || paused || requestInProgress) return;
    const session = deps.getAccessToken();
    if (!session) {
      status("signed-out");
      return;
    }
    if (session === blockedSession) return;
    if (!deps.environment) {
      status("configuration-error");
      return;
    }
    const version = ++permissionVersion;
    const isCurrent = () =>
      !disposed &&
      !paused &&
      version === permissionVersion &&
      session === deps.getAccessToken();
    try {
      let permission = await deps.checkPermissions();
      if (!isCurrent()) return;
      if (askPermission && permission.receive === "prompt") {
        requestInProgress = true;
        try {
          permission = await deps.requestPermissions();
        } finally {
          requestInProgress = false;
        }
        if (!isCurrent()) {
          if (!disposed) void refresh();
          return;
        }
      }
      if (permission.receive !== "granted") {
        stopUpload();
        clearWatchdog();
        status(permission.receive === "denied" ? "denied" : "prompt");
        return;
      }
      status("registering");
      clearWatchdog();
      watchdog = setTimeout(() => {
        if (isCurrent()) status("error");
      }, 20_000);
      await deps.register();
    } catch {
      if (isCurrent()) {
        clearWatchdog();
        status("error");
      }
    }
  };

  return {
    refresh,
    receiveToken,
    registrationFailed: () => {
      if (paused) return;
      clearWatchdog();
      status(deps.getAccessToken() ? "error" : "signed-out");
    },
    sessionChanged: () => {
      if (disposed) return;
      permissionVersion++;
      stopUpload();
      clearWatchdog();
      // 무효 세션 차단은 같은 access token에만 적용하며, 새 로그인 토큰은 다시 등록한다.
      if (blockedSession !== deps.getAccessToken()) blockedSession = null;
      void refresh();
    },
    pause: () => {
      paused = true;
      const version = ++pauseVersion;
      permissionVersion++;
      stopUpload();
      clearWatchdog();
      return () => {
        if (disposed || !paused || version !== pauseVersion) return;
        paused = false;
        void refresh();
      };
    },
    dispose: () => {
      disposed = true;
      permissionVersion++;
      clearWatchdog();
      stopUpload();
    },
  };
}
