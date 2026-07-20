import { getAccessToken } from "./auth";

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

// 공통 요청 헬퍼. 응답 봉투를 벗겨 result만 반환하고, 실패 시 ApiError를 던진다.
// credentials: "include" — refreshToken(httpOnly 쿠키) 수신·전송에 필요
export async function apiRequest<T>(
  path: string,
  { method = "GET", body, auth = false }: RequestOptions = {},
): Promise<T> {
  const headers: Record<string, string> = {};

  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  if (auth) {
    const token = getAccessToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
    credentials: "include",
  });

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
