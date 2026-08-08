// 닉네임 형식 규칙 (온보딩·수정 공용)
// - 2~6자, 한글/영문/숫자/공백만 허용 (특수문자·이모지 불가)
// - 중복 검사는 별도(GET /api/mypage/nickname/check)로 처리한다.
export const NICKNAME_MIN_LENGTH = 2;
export const NICKNAME_MAX_LENGTH = 6;

// 완성형 한글 + 자모(입력 중 상태) + 영문/숫자/공백. 그 외(특수문자·이모지)는 불가.
const NICKNAME_ALLOWED_RE = /^[가-힣ㄱ-ㅎㅏ-ㅣa-zA-Z0-9 ]+$/;

export type NicknameFormatStatus = "empty" | "invalid" | "valid";

// 앞뒤 공백은 무시하고 형식만 판별한다.
export function getNicknameFormatStatus(value: string): NicknameFormatStatus {
  const trimmed = value.trim();
  if (trimmed === "") return "empty";
  if (trimmed.length < NICKNAME_MIN_LENGTH) return "invalid";
  if (trimmed.length > NICKNAME_MAX_LENGTH) return "invalid";
  if (!NICKNAME_ALLOWED_RE.test(trimmed)) return "invalid";
  return "valid";
}

export const NICKNAME_GUIDE_TEXT = `최대 ${NICKNAME_MAX_LENGTH}자 설정 가능`;
export const NICKNAME_INVALID_TEXT = "사용할 수 없는 닉네임이에요.";
