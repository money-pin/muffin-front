import { useEffect, useState } from "react";

import { ApiError } from "./api";
import { checkNickname } from "./mypageApi";
import { getNicknameFormatStatus } from "./nickname";

export type NicknameCheckStatus =
  | "empty" // 입력 전
  | "invalid" // 형식 오류(2~6자, 한글/영문/숫자/공백)
  | "banned" // 서버가 사용할 수 없는 단어로 판단(비속어 등)
  | "checking"
  | "available"
  | "taken"
  | "error"; // 확인 요청 실패

const CHECK_DELAY_MS = 400;

interface CheckResult {
  nickname: string;
  status: "available" | "taken" | "banned" | "error";
}

// 닉네임 형식 확인 후, 입력이 멈추면 서버에 사용 가능 여부를 묻는다 (#333)
// 결과는 비동기 콜백에서만 저장하고, 표시 상태는 렌더에서 파생한다.
export function useNicknameCheck(value: string): NicknameCheckStatus {
  const trimmed = value.trim();
  const formatStatus = getNicknameFormatStatus(value);
  const [result, setResult] = useState<CheckResult | null>(null);

  useEffect(() => {
    if (formatStatus !== "valid") return;
    let active = true;
    const timer = window.setTimeout(() => {
      checkNickname(trimmed)
        .then(({ available }) => {
          if (active) {
            setResult({
              nickname: trimmed,
              status: available ? "available" : "taken",
            });
          }
        })
        .catch((error: unknown) => {
          if (!active) return;
          // 형식·비속어 위반은 400(COMMON_400_001, USER_400_001)으로 온다
          const banned =
            error instanceof ApiError && error.code.includes("_400_");
          setResult({ nickname: trimmed, status: banned ? "banned" : "error" });
        });
    }, CHECK_DELAY_MS);
    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [trimmed, formatStatus]);

  if (formatStatus !== "valid") return formatStatus;
  return result?.nickname === trimmed ? result.status : "checking";
}
