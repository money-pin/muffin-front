import { logout } from "./authApi";
import { clearAccessToken, getAuthSessionRevision } from "./auth";
import { clearNotificationDestination } from "./notificationNavigation";
import { pauseIosPushRegistration } from "./push/iosPush";

export interface LogoutResult {
  loggedOut: boolean;
  serverRevoked: boolean;
}

let pending: Promise<LogoutResult> | null = null;
let pendingSession: number | null = null;

async function performLogout(session: number): Promise<LogoutResult> {
  const resumePushRegistration = pauseIosPushRegistration();
  const controller = new AbortController();
  let timeout: ReturnType<typeof setTimeout> | undefined;
  let onAbort: (() => void) | undefined;
  let serverRevoked = false;
  try {
    // 네이티브 전송이 취소를 무시해도 화면의 대기는 제한한다.
    const interrupted = new Promise<never>((_resolve, reject) => {
      onAbort = () => reject(new Error("Logout timed out"));
      controller.signal.addEventListener("abort", onAbort, { once: true });
      timeout = setTimeout(() => controller.abort(), 3_000);
    });
    await Promise.race([logout(controller.signal), interrupted]);
    serverRevoked = true;
  } catch {
    // 서버 해제를 확인하지 못해도 사용자를 로그인 상태에 가두지 않는다.
    // 서버 세션/푸시 연결 해제 성공과 로컬 로그아웃 성공은 구분해서 반환한다.
  } finally {
    clearTimeout(timeout);
    if (onAbort) controller.signal.removeEventListener("abort", onAbort);
  }
  try {
    // 이전 로그아웃 응답으로 새 계정의 로그인을 지우지 않는다.
    if (getAuthSessionRevision() !== session)
      return { loggedOut: false, serverRevoked };
    clearNotificationDestination();
    clearAccessToken();
    return { loggedOut: true, serverRevoked };
  } finally {
    resumePushRegistration();
  }
}

// 연속 클릭·재렌더링에 의한 동일 세션의 중복 POST를 막는다.
export function logoutSession(): Promise<LogoutResult> {
  const session = getAuthSessionRevision();
  if (pending && pendingSession === session) return pending;
  const task = performLogout(session);
  pendingSession = session;
  pending = task;
  const cleanup = () => {
    if (pending === task) {
      pending = null;
      pendingSession = null;
    }
  };
  void task.then(cleanup, cleanup);
  return task;
}
