import { Capacitor } from "@capacitor/core";

import type { AuthProvider } from "./auth";

// Google Analytics 4 (#325)
// - 측정 ID(VITE_GA_MEASUREMENT_ID)가 없으면 아무것도 하지 않는다 (로컬 개발 등)
// - 화면 조회(page_view)는 GA4 "향상된 측정 > 브라우저 기록 이벤트 기반 페이지 변경"이 자동으로 수집한다
// - iOS 앱(WebView)은 쿠키가 유지되지 않을 수 있어 사용자 ID(client_id)를 직접 저장해 같은 사용자로 집계한다
const MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID as
  string | undefined;
const CLIENT_ID_KEY = "muffin:gaClientId";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function getAppClientId() {
  try {
    const saved = localStorage.getItem(CLIENT_ID_KEY);
    if (saved) return saved;
    const created = `${Math.floor(Math.random() * 2 ** 31)}.${Math.floor(Date.now() / 1000)}`;
    localStorage.setItem(CLIENT_ID_KEY, created);
    return created;
  } catch {
    return undefined;
  }
}

export function initAnalytics() {
  if (!MEASUREMENT_ID || typeof window === "undefined" || window.gtag) return;

  window.dataLayer = window.dataLayer ?? [];
  window.gtag = function gtag() {
    // gtag.js는 배열이 아닌 arguments 객체를 받아야 동작한다
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer?.push(arguments);
  };
  window.gtag("js", new Date());

  const isNativeApp = Capacitor.isNativePlatform();
  window.gtag("config", MEASUREMENT_ID, {
    // 앱/웹 구분용 (GA4 맞춤 측정기준으로 등록해 사용)
    app_platform: isNativeApp ? Capacitor.getPlatform() : "web",
    ...(isNativeApp
      ? { client_storage: "none", client_id: getAppClientId() }
      : {}),
  });

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(MEASUREMENT_ID)}`;
  document.head.appendChild(script);
}

export function trackEvent(name: string, params?: Record<string, unknown>) {
  window.gtag?.("event", name, params);
}

// 소셜 로그인 성공: 처음 가입이면 sign_up, 기존 회원이면 login (GA4 권장 이벤트)
export function trackAuth(
  provider: AuthProvider,
  entryRoute: "/home" | "/onboarding",
) {
  trackEvent(entryRoute === "/onboarding" ? "sign_up" : "login", {
    method: provider,
  });
}
