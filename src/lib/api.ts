import { clearAccessToken, getAccessToken, saveAccessToken } from "./auth";
import { rememberNotificationDestination } from "./notificationNavigation";

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
  signal?: AbortSignal;
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
  rememberNotificationDestination(
    window.location.pathname + window.location.search,
  );
  clearAccessToken();
  if (window.location.pathname !== LOGIN_PATH) {
    window.location.replace(LOGIN_PATH);
  }
}

// 재발급 요청은 동시에 401이 몰려도 한 번만 실행되도록 single-flight로 공유한다.
let refreshPromise: Promise<boolean> | null = null;
let refreshSourceToken: string | null = null;

async function refreshAccessToken(): Promise<boolean> {
  const sourceToken = getAccessToken();
  // 로컬 로그아웃 뒤 남은 HttpOnly 쿠키만으로 로그인을 되살리지 않는다.
  if (!sourceToken) return false;
  if (!refreshPromise || refreshSourceToken !== sourceToken) {
    const task = (async () => {
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
        // 등록 요청 중 로그아웃·계정 전환이 일어나면 이전 세션을 되살리지 않는다.
        if (getAccessToken() !== sourceToken) return false;
        saveAccessToken(envelope.result.accessToken, { preserveSession: true });
        return true;
      } catch {
        return false;
      }
    })();
    refreshPromise = task;
    refreshSourceToken = sourceToken;
    // 성공/실패와 무관하게 한 사이클이 끝나면 초기화해 다음 만료 때 다시 시도할 수 있게 한다.
    void task.finally(() => {
      if (refreshPromise === task) {
        refreshPromise = null;
        refreshSourceToken = null;
      }
    });
  }
  return refreshPromise;
}

// 공통 요청 헬퍼. 응답 봉투를 벗겨 result만 반환하고, 실패 시 ApiError를 던진다.
// credentials: "include" — refreshToken(httpOnly 쿠키) 수신·전송에 필요
// accessToken 만료(401) 시 재발급 후 원요청을 1회 재시도한다.
export async function apiRequest<T>(
  path: string,
  { method = "GET", body, auth = false, signal }: RequestOptions = {},
): Promise<T> {
  let sentToken: string | null = null;
  const sendRequest = async () => {
    const headers: Record<string, string> = {};

    if (body !== undefined) {
      headers["Content-Type"] = "application/json";
    }

    if (auth) {
      const token = getAccessToken();
      sentToken = token;
      if (token) headers.Authorization = `Bearer ${token}`;
    }

    return fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      credentials: "include",
      signal,
    });
  };

  let response = await sendRequest();

  // 기기 등록의 폐기된 세션은 refresh로 복구하면 안 된다. 다른 계정으로
  // 전환한 뒤 도착한 이전 요청의 응답으로 현재 로그인까지 지우지도 않는다.
  const rejectInvalidSession = async (reply: Response) => {
    if (reply.status !== 401 || !auth) return;
    const envelope = (await reply
      .clone()
      .json()
      .catch(() => null)) as ApiEnvelope<unknown> | null;
    if (envelope?.code !== "AUTH_401_005") return;
    if (!signal?.aborted && sentToken === getAccessToken()) redirectToLogin();
    throw new ApiError(envelope.message, "AUTH_401_005");
  };
  await rejectInvalidSession(response);
  signal?.throwIfAborted();

  // 인증 요청이 401이면 재발급 시도 후 1회 재시도 (재발급 요청 자체는 제외)
  if (response.status === 401 && auth && path !== REFRESH_PATH) {
    if (sentToken !== getAccessToken())
      throw new ApiError(
        "인증 상태가 변경되어 요청을 중단했어요.",
        "AUTH_SESSION_CHANGED",
      );
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      signal?.throwIfAborted();
      response = await sendRequest();
      await rejectInvalidSession(response);
    } else {
      signal?.throwIfAborted();
      if (sentToken === getAccessToken()) redirectToLogin();
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
  signal?.throwIfAborted();

  if (!response.ok || !envelope?.isSuccess) {
    throw new ApiError(
      envelope?.message ?? "요청에 실패했어요. 잠시 후 다시 시도해주세요.",
      envelope?.code ?? String(response.status),
    );
  }

  return envelope.result;
}
