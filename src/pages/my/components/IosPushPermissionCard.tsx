import { useSyncExternalStore } from "react";
import {
  getIosPushStatus,
  isIosPushSupported,
  requestIosPushPermission,
  subscribeIosPush,
} from "@/lib/push/iosPush";

const MESSAGES = {
  checking: "기기 알림 상태를 확인하고 있어요.",
  prompt: "퀴즈와 투자 결과를 알림으로 받아보세요.",
  denied: "iPhone 설정 > 알림 > 머핀에서 알림을 허용해주세요.",
  "signed-out": "로그인 후 기기 알림을 연결할 수 있어요.",
  registering: "기기 알림을 연결하고 있어요.",
  ready: "기기 알림이 연결되어 있어요.",
  error: "기기 알림을 연결하지 못했어요. 다시 확인해주세요.",
  "configuration-error":
    "앱의 알림 설정이 올바르지 않아요. 업데이트 후 다시 확인해주세요.",
} as const;

export default function IosPushPermissionCard() {
  const status = useSyncExternalStore(
    subscribeIosPush,
    getIosPushStatus,
    getIosPushStatus,
  );
  if (!isIosPushSupported()) return null;
  const canRetry = ["prompt", "denied", "error"].includes(status);
  return (
    <div className="flex min-w-0 flex-col gap-2 rounded-xl bg-neutral-50 p-3 break-keep">
      <p role="status" className="text-body-14-md text-neutral-600">
        {MESSAGES[status]}
      </p>
      {canRetry && (
        <button
          type="button"
          onClick={() => {
            void requestIosPushPermission();
          }}
          className="text-body-14-bd text-primary min-h-11 self-start rounded-lg px-2"
        >
          {status === "prompt" ? "기기 알림 켜기" : "알림 연결 다시 확인"}
        </button>
      )}
    </div>
  );
}
