// Google Identity Services(GIS) 스크립트 로더
// FE에서 구글 ID 토큰을 받아 백엔드(POST /api/auth/google)에 넘겨 앱 토큰으로 교환한다.
const GIS_SRC = "https://accounts.google.com/gsi/client";

export interface GoogleCredentialResponse {
  credential: string; // 구글 ID 토큰(JWT)
}

interface GoogleButtonOptions {
  type?: "standard" | "icon";
  theme?: "outline" | "filled_blue" | "filled_black";
  size?: "small" | "medium" | "large";
  width?: number;
}

interface GoogleAccountsId {
  initialize(config: {
    client_id: string;
    callback: (response: GoogleCredentialResponse) => void;
  }): void;
  renderButton(parent: HTMLElement, options: GoogleButtonOptions): void;
  prompt(): void;
}

export interface GoogleIdentity {
  accounts: { id: GoogleAccountsId };
}

declare global {
  interface Window {
    google?: GoogleIdentity;
  }
}

let loadPromise: Promise<GoogleIdentity> | null = null;

export function loadGoogleIdentity(): Promise<GoogleIdentity> {
  if (window.google) return Promise.resolve(window.google);
  if (loadPromise) return loadPromise;

  loadPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = GIS_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.google) resolve(window.google);
      else reject(new Error("구글 로그인 초기화에 실패했어요."));
    };
    script.onerror = () => {
      loadPromise = null;
      reject(new Error("구글 로그인 스크립트를 불러오지 못했어요."));
    };
    document.head.appendChild(script);
  });

  return loadPromise;
}
