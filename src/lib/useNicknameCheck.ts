import { useEffect, useState } from "react";

import { ApiError } from "./api";
import { checkNickname } from "./mypageApi";
import { getNicknameFormatStatus } from "./nickname";

export type NicknameCheckStatus =
  | "empty" // 입력 전
  | "invalid" // 형식 오류(2~6자, 한글/영문/숫자/공백)
  | "own" // 이미 내 닉네임으로 저장된 값(서버 확인 불필요)
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
// ownNickname: 이미 내 것으로 저장된 닉네임. 서버는 이것도 '사용 중'으로 답하므로 확인하지 않는다.
export function useNicknameCheck(
  value: string,
  ownNickname?: string,
): NicknameCheckStatus {
  const trimmed = value.trim();
  const formatStatus = getNicknameFormatStatus(value);
  const isOwn = Boolean(ownNickname) && trimmed === ownNickname;
  const shouldCheck = formatStatus === "valid" && !isOwn;
  const [result, setResult] = useState<CheckResult | null>(null);

  // 입력이 바뀌면 이전 확인 결과를 버린다. A → B → A로 돌아와도 예전 'A 사용 가능'을
  // 다시 쓰지 않고, 새 응답이 올 때까지 'checking'으로 둔다 (#334 리뷰)
  const [checkedInput, setCheckedInput] = useState(trimmed);
  if (checkedInput !== trimmed) {
    setCheckedInput(trimmed);
    setResult(null);
  }

  useEffect(() => {
    if (!shouldCheck) return;
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
  }, [trimmed, shouldCheck]);

  if (formatStatus !== "valid") return formatStatus;
  if (isOwn) return "own";
  return result?.nickname === trimmed ? result.status : "checking";
}
