// 구글 로그인 (OpenID Connect 리다이렉트 방식, #291)
// 구글 기본 버튼(GIS)은 투명하게 겹치면 클릭이 무시되어 Figma 버튼을 쓸 수 없으므로,
// 우리 버튼을 누르면 구글 로그인 페이지로 이동했다가 /auth/google/callback으로 돌아오며
// ID 토큰을 받는다. 받은 토큰은 기존과 같이 POST /auth/google { idToken }으로 넘긴다.
// ⚠️ 리디렉션 URI(`{origin}/auth/google/callback`)를 Google Cloud Console에 등록해야 한다.
// iOS 앱(WebView)에서는 구글이 로그인 페이지를 막으므로 네이티브 로그인으로 대체한다. (#266)
const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
export const GOOGLE_CALLBACK_PATH = "/auth/google/callback";
const REQUEST_STORAGE_KEY = "muffin.googleAuthRequest";

// 위조 응답을 막기 위해 요청마다 만들어 두고 돌아왔을 때 비교한다
interface GoogleAuthRequest {
  state: string;
  nonce: string;
}

export class GoogleAuthError extends Error {}

function createRandomToken() {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join(
    "",
  );
}

function getRedirectUri() {
  return `${window.location.origin}${GOOGLE_CALLBACK_PATH}`;
}

// 구글 로그인 페이지로 이동한다
export function startGoogleLogin(clientId: string) {
  const request: GoogleAuthRequest = {
    state: createRandomToken(),
    nonce: createRandomToken(),
  };
  sessionStorage.setItem(REQUEST_STORAGE_KEY, JSON.stringify(request));

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: getRedirectUri(),
    response_type: "id_token",
    scope: "openid email profile",
    state: request.state,
    nonce: request.nonce,
    prompt: "select_account",
  });

  window.location.assign(`${GOOGLE_AUTH_URL}?${params}`);
}

function takeSavedRequest(): GoogleAuthRequest | null {
  try {
    const saved = sessionStorage.getItem(REQUEST_STORAGE_KEY);
    sessionStorage.removeItem(REQUEST_STORAGE_KEY);
    return saved ? (JSON.parse(saved) as GoogleAuthRequest) : null;
  } catch {
    return null;
  }
}

function readTokenNonce(idToken: string): string | undefined {
  try {
    const payload = idToken.split(".")[1];
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = new TextDecoder().decode(
      Uint8Array.from(atob(base64), (char) => char.charCodeAt(0)),
    );
    return (JSON.parse(json) as { nonce?: string }).nonce;
  } catch {
    return undefined;
  }
}

// 콜백 URL의 #fragment에서 ID 토큰을 꺼내고 요청과 맞는지 확인한다.
// 저장해 둔 요청은 한 번 읽으면 지워지므로 콜백마다 한 번만 호출한다.
export function readGoogleCallback(hash: string): string {
  const params = new URLSearchParams(hash.replace(/^#/, ""));
  const request = takeSavedRequest();

  const error = params.get("error");
  if (error === "access_denied") {
    throw new GoogleAuthError("구글 로그인을 취소했어요.");
  }
  if (error) {
    throw new GoogleAuthError(
      "구글 로그인에 실패했어요. 잠시 후 다시 시도해주세요.",
    );
  }

  const idToken = params.get("id_token");
  if (
    !request ||
    !idToken ||
    params.get("state") !== request.state ||
    readTokenNonce(idToken) !== request.nonce
  ) {
    throw new GoogleAuthError("로그인 요청이 만료됐어요. 다시 시도해주세요.");
  }

  return idToken;
}
