import { Capacitor, type PluginListenerHandle } from "@capacitor/core";
import { PushNotifications } from "@capacitor/push-notifications";
import { AUTH_SESSION_CHANGED_EVENT, getAccessToken } from "@/lib/auth";
import { ApiError } from "@/lib/api";
import { resolveNotificationDestination } from "@/lib/notificationNavigation";
import { registerDeviceToken } from "./deviceTokenApi";
import {
  createDeviceTokenRegistration,
  parseApnsEnvironment,
  type IosPushStatus,
} from "./deviceTokenRegistration";

let state: IosPushStatus = "checking";
const subscribers = new Set<() => void>();
const publish = (value: IosPushStatus) => {
  if (state === value) return;
  state = value;
  subscribers.forEach((listener) => listener());
};
export const subscribeIosPush = (listener: () => void) => {
  subscribers.add(listener);
  return () => {
    subscribers.delete(listener);
  };
};
export const getIosPushStatus = () => state;
export const isIosPushSupported = () =>
  Capacitor.isNativePlatform() && Capacitor.getPlatform() === "ios";

let controller: ReturnType<typeof createDeviceTokenRegistration> | null = null;
let startPromise: Promise<void> | null = null;
let navigateNotification: ((path: string) => void) | null = null;

export function initializeIosPush(onNavigate: (path: string) => void) {
  if (!isIosPushSupported() || controller) return () => {};
  navigateNotification = onNavigate;
  const instance = createDeviceTokenRegistration({
    environment: parseApnsEnvironment(import.meta.env.VITE_APNS_ENVIRONMENT),
    getAccessToken,
    checkPermissions: () => PushNotifications.checkPermissions(),
    requestPermissions: () => PushNotifications.requestPermissions(),
    register: () => PushNotifications.register(),
    upload: registerDeviceToken,
    errorCode: (error) => (error instanceof ApiError ? error.code : undefined),
    onStatus: publish,
  });
  controller = instance;
  let disposed = false;
  const listeners: PluginListenerHandle[] = [];
  const add = async (promise: Promise<PluginListenerHandle>) => {
    const handle = await promise;
    if (disposed) await handle.remove();
    else listeners.push(handle);
  };
  const sessionChanged = () => instance.sessionChanged();
  const visibilityChanged = () => {
    if (document.visibilityState === "visible") void instance.refresh();
  };
  const cleanup = () => {
    if (disposed) return;
    disposed = true;
    instance.dispose();
    window.removeEventListener(AUTH_SESSION_CHANGED_EVENT, sessionChanged);
    document.removeEventListener("visibilitychange", visibilityChanged);
    listeners.forEach((handle) => {
      void handle.remove().catch(() => {});
    });
    if (controller === instance) {
      controller = null;
      startPromise = null;
    }
  };
  startPromise = (async () => {
    try {
      // SDK가 탭 이벤트를 보관하므로 종료 상태에서 시작해도 리스너 등록 시 전달된다.
      await add(
        PushNotifications.addListener(
          "pushNotificationActionPerformed",
          (action) => {
            if (disposed || action.actionId !== "tap") return;
            const destination = resolveNotificationDestination(
              action.notification.data?.deepLink,
              window.location.origin,
            );
            if (destination)
              onNavigate(
                `/notifications/open?url=${encodeURIComponent(destination)}`,
              );
          },
        ),
      );
      await add(
        PushNotifications.addListener("registration", ({ value }) => {
          void instance.receiveToken(value);
        }),
      );
      await add(
        PushNotifications.addListener("registrationError", () =>
          instance.registrationFailed(),
        ),
      );
      // 포그라운드 수신은 설정(presentationOptions: [])에 따라 표시·이동하지 않는다.
      await add(
        PushNotifications.addListener("pushNotificationReceived", () => {}),
      );
      if (disposed) return;
      window.addEventListener(AUTH_SESSION_CHANGED_EVENT, sessionChanged);
      document.addEventListener("visibilitychange", visibilityChanged);
      await instance.refresh();
    } catch {
      if (!disposed) {
        publish("error");
        cleanup();
      }
    }
  })();
  return cleanup;
}

// 온보딩 완료 후 첫 홈 진입 또는 설정의 명시적인 재확인에서 호출한다.
export async function requestIosPushPermission() {
  await startPromise;
  if (!controller && navigateNotification) {
    initializeIosPush(navigateNotification);
    await startPromise;
  }
  await controller?.refresh(true);
}

// 서버 로그아웃 요청과 토큰 PUT이 겹치지 않도록 등록만 일시 중단한다.
// 서버의 토큰 삭제나 OS 알림 권한 해제를 대신하지 않는다.
export function pauseIosPushRegistration() {
  return controller?.pause() ?? (() => {});
}
