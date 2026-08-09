import { clearAccessToken, getAccessToken, saveAccessToken } from "./auth";

// 백엔드 공통 응답 봉투
interface ApiEnvelope<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

export class ApiError extends Error {
  code: string;

  constructor(message: string, code: string) {
    super(message);
    this.name = "ApiError";
    this.code = code;
  }
}

interface RequestOptions {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
  auth?: boolean; // true면 Authorization 헤더에 accessToken 첨부
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

// refreshToken 쿠키로 accessToken을 재발급하는 엔드포인트 (/api 아님에 주의)
const REFRESH_PATH = "/auth/token/refresh";
const LOGIN_PATH = "/login";

if (!BASE_URL) {
  console.warn(
    "VITE_API_BASE_URL이 비어 있어 요청이 현재 주소로 전송됩니다(404). .env를 확인해주세요.",
  );
}

// 만료 세션 정리 후 로그인으로 이동 (이미 로그인 화면이면 이동하지 않음)
function redirectToLogin() {
  clearAccessToken();
  if (window.location.pathname !== LOGIN_PATH) {
    window.location.replace(LOGIN_PATH);
  }
}

// 재발급 요청은 동시에 401이 몰려도 한 번만 실행되도록 single-flight로 공유한다.
let refreshPromise: Promise<boolean> | null = null;

async function refreshAccessToken(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      try {
        const response = await fetch(`${BASE_URL}${REFRESH_PATH}`, {
          method: "POST",
          credentials: "include",
        });
        if (!response.ok) return false;

        const envelope = (await response
          .json()
          .catch(() => null)) as ApiEnvelope<{ accessToken: string }> | null;

        if (!envelope?.isSuccess || !envelope.result?.accessToken) {
          return false;
        }
        saveAccessToken(envelope.result.accessToken);
        return true;
      } catch {
        return false;
      }
    })();
    // 성공/실패와 무관하게 한 사이클이 끝나면 초기화해 다음 만료 때 다시 시도할 수 있게 한다.
    void refreshPromise.finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

// 공통 요청 헬퍼. 응답 봉투를 벗겨 result만 반환하고, 실패 시 ApiError를 던진다.
// credentials: "include" — refreshToken(httpOnly 쿠키) 수신·전송에 필요
// accessToken 만료(401) 시 재발급 후 원요청을 1회 재시도한다.
export async function apiRequest<T>(
  path: string,
  { method = "GET", body, auth = false }: RequestOptions = {},
): Promise<T> {
  const sendRequest = async () => {
    const headers: Record<string, string> = {};

    if (body !== undefined) {
      headers["Content-Type"] = "application/json";
    }

    if (auth) {
      const token = getAccessToken();
      if (token) headers.Authorization = `Bearer ${token}`;
    }

    return fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      credentials: "include",
    });
  };

  let response = await sendRequest();

  // 인증 요청이 401이면 재발급 시도 후 1회 재시도 (재발급 요청 자체는 제외)
  if (response.status === 401 && auth && path !== REFRESH_PATH) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      response = await sendRequest();
    } else {
      redirectToLogin();
      throw new ApiError(
        "로그인이 만료되었어요. 다시 로그인해주세요.",
        "AUTH_401_001",
      );
    }
  }

  let envelope: ApiEnvelope<T> | null = null;
  try {
    envelope = (await response.json()) as ApiEnvelope<T>;
  } catch {
    // JSON이 아닌 응답(502 등)
  }

  if (!response.ok || !envelope?.isSuccess) {
    throw new ApiError(
      envelope?.message ?? "요청에 실패했어요. 잠시 후 다시 시도해주세요.",
      envelope?.code ?? String(response.status),
    );
  }

  return envelope.result;
}
