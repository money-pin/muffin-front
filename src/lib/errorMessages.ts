export type ErrorAction =
  "close" | "login" | "onboarding" | "previousOrHome" | "retry";

export type ErrorModalVariant = "error" | "info";

export interface ErrorMessageInfo {
  title: string;
  description: string;
  primaryLabel: string;
  secondaryLabel?: string;
  action: ErrorAction;
  variant: ErrorModalVariant;
  showIcon?: boolean;
}

export const DEFAULT_ERROR_MESSAGE: ErrorMessageInfo = {
  title: "일시적인 오류가 발생했어요.",
  description: "네트워크 상태를 확인하고\n다시 시도해주세요.",
  primaryLabel: "다시 시도",
  secondaryLabel: "취소",
  action: "retry",
  variant: "error",
};

// 화면별로 다른 문구가 필요한 공통 코드는 getErrorMessage(code, overrides)로 덮어쓴다.
// 코드가 아직 확정되지 않은 에러는 매핑하지 않고, 확정 후 추가한다.
const errorMessageMap: Record<string, ErrorMessageInfo> = {
  COMMON_400_001: {
    title: "요청 정보를 확인해주세요.",
    description: "요청 정보를 다시 확인하고 시도해주세요.",
    primaryLabel: "확인",
    action: "close",
    variant: "error",
  },
  COMMON_400_002: {
    title: "요청 정보를 다시 확인해주세요.",
    description: "입력한 정보를 확인하고 다시 시도해주세요.",
    primaryLabel: "확인",
    action: "close",
    variant: "error",
  },
  COMMON_404_001: {
    title: "요청을 처리할 수 없어요.",
    description: "잠시 후 다시 시도해주세요.",
    primaryLabel: "확인",
    action: "close",
    variant: "error",
  },
  AUTH_401_001: {
    title: "로그인이 필요해요.",
    description: "인증이 만료되었습니다.\n다시 로그인해주세요.",
    primaryLabel: "로그인",
    secondaryLabel: "취소",
    action: "login",
    variant: "info",
  },
  AUTH_400_002: {
    title: "약관에 동의해주세요.",
    description: "회원가입을 위해 필수 약관 동의가 필요합니다.",
    primaryLabel: "확인",
    action: "close",
    variant: "error",
  },
  AUTH_409_001: {
    title: "이미 가입된 이메일이에요.",
    description: "다른 이메일을 입력하거나 로그인해주세요.",
    primaryLabel: "확인",
    action: "close",
    variant: "error",
  },
  AUTH_409_002: {
    title: "이미 인증이 완료된 이메일이에요.",
    description: "다음 단계로 진행해주세요.",
    primaryLabel: "확인",
    action: "close",
    variant: "info",
  },
  AUTH_409_003: {
    title: "재가입할 수 없는 이메일이에요.",
    description: "탈퇴 후 30일이 지나면 다시 가입할 수 있습니다.",
    primaryLabel: "확인",
    action: "close",
    variant: "error",
  },
  AUTH_429_001: {
    title: "잠시 후 다시 시도해주세요.",
    description: "인증번호는 잠시 후 다시 요청할 수 있습니다.",
    primaryLabel: "확인",
    action: "close",
    variant: "error",
  },
  AUTH_429_002: {
    title: "오늘 인증번호 발송 횟수를 초과했어요.",
    description: "내일 다시 시도해주세요.",
    primaryLabel: "확인",
    action: "close",
    variant: "error",
  },
  AUTH_500_001: {
    title: "인증 메일을 보내지 못했어요.",
    description: "잠시 후 다시 시도해주세요.",
    primaryLabel: "다시 시도",
    secondaryLabel: "취소",
    action: "retry",
    variant: "error",
  },
  USER_409_001: {
    title: "온보딩을 먼저 완료해주세요.",
    description: "서비스 이용을 위해 온보딩을 먼저 진행해야 합니다.",
    primaryLabel: "확인",
    action: "onboarding",
    variant: "info",
  },
  USER_400_001: {
    title: "사용할 수 없는 닉네임이에요.",
    description: "부적절한 표현이 포함되어 있어 사용할 수 없습니다.",
    primaryLabel: "확인",
    action: "close",
    variant: "error",
  },
  USER_409_002: {
    title: "이미 사용 중인 닉네임이에요.",
    description: "다른 닉네임을 입력해주세요.",
    primaryLabel: "확인",
    action: "close",
    variant: "error",
  },
  USER_404_001: {
    title: "다시 로그인해주세요.",
    description:
      "사용자 정보를 확인할 수 없습니다.\n다시 로그인한 뒤 이용해주세요.",
    primaryLabel: "로그인",
    action: "login",
    variant: "info",
  },
  MYPAGE_404_001: {
    title: "다시 로그인해주세요.",
    description:
      "사용자 정보를 확인할 수 없습니다.\n다시 로그인한 뒤 이용해주세요.",
    primaryLabel: "로그인",
    action: "login",
    variant: "info",
  },
  MYPAGE_400_004: {
    title: "요청 정보를 확인해주세요.",
    description:
      "페이지를 불러오는 중 오류가 발생했습니다.\n다시 시도해주세요.",
    primaryLabel: "확인",
    action: "close",
    variant: "error",
  },
  MYPAGE_400_005: {
    title: "조회 기간을 확인해주세요.",
    description: "월은 1~12 사이의 값만 입력할 수 있습니다.",
    primaryLabel: "확인",
    action: "close",
    variant: "error",
  },
  SECTOR_503_001: {
    title: "거래소 정보를 불러오지 못했어요.",
    description: "잠시 후 다시 시도해주세요.",
    primaryLabel: "다시 시도",
    secondaryLabel: "취소",
    action: "retry",
    variant: "error",
  },
  INVESTMENT_400_001: {
    title: "현재는 투자할 수 없는 시간이에요.",
    description: "투자 가능 시간에 다시 이용해주세요.",
    primaryLabel: "확인",
    action: "close",
    variant: "info",
  },
  INVESTMENT_400_002: {
    title: "투자할 수 없는 섹터가 포함되어 있어요.",
    description: "선택한 섹터를 다시 확인해주세요.",
    primaryLabel: "확인",
    action: "close",
    variant: "error",
  },
  INVESTMENT_400_003: {
    title: "보유 자산이 부족해요.",
    description: "투자 금액을 조정한 뒤 다시 시도해주세요.",
    primaryLabel: "확인",
    action: "close",
    variant: "error",
  },
  INVESTMENT_409_001: {
    title: "오늘은 이미 다른 투자로 확정되었어요.",
    description: "오늘 확정한 투자만 유지할 수 있습니다.",
    primaryLabel: "확인",
    action: "close",
    variant: "info",
  },
  INVESTMENT_409_002: {
    title: "투자를 시작할 준비가 아직 완료되지 않았어요.",
    description: "온보딩을 완료한 뒤 다시 이용해주세요.",
    primaryLabel: "확인",
    action: "onboarding",
    variant: "info",
  },
  INVESTMENT_404_001: {
    title: "수정할 투자 내역이 없어요.",
    description: "오늘 확정한 투자만 수정할 수 있습니다.",
    primaryLabel: "확인",
    action: "close",
    variant: "error",
  },
  QUIZ_400_001: {
    title: "답안을 제출할 수 없어요.",
    description: "선택한 답안을 다시 확인해주세요.",
    primaryLabel: "확인",
    action: "close",
    variant: "error",
  },
  QUIZ_400_003: {
    title: "날짜 형식을 확인해주세요.",
    description: "날짜는 yyyy-mm-dd 형식으로 입력해주세요.",
    primaryLabel: "확인",
    action: "close",
    variant: "error",
  },
  QUIZ_404_002: {
    title: "퀴즈를 불러올 수 없어요.",
    description: "잠시 후 다시 시도해주세요.",
    primaryLabel: "확인",
    action: "previousOrHome",
    variant: "error",
  },
  QUIZ_409_001: {
    title: "퀴즈를 모두 완료해주세요.",
    description: "모든 문제를 푼 뒤 결과를 확인할 수 있습니다.",
    primaryLabel: "확인",
    action: "close",
    variant: "info",
  },
  CONTENT_403_001: {
    title: "아직 공개되지 않은 뉴스예요.",
    description: "공개 후 다시 확인해주세요.",
    primaryLabel: "확인",
    action: "close",
    variant: "info",
  },
  CONTENT_404_001: {
    title: "뉴스를 찾을 수 없어요.",
    description: "삭제되었거나 존재하지 않는 뉴스입니다.",
    primaryLabel: "확인",
    action: "previousOrHome",
    variant: "error",
  },
  CONTENT_404_002: {
    title: "용어 정보를 찾을 수 없어요.",
    description: "잠시 후 다시 시도해주세요.",
    primaryLabel: "확인",
    action: "close",
    variant: "error",
  },
  CONTENT_409_001: {
    title: "뉴스 해설을 준비 중이에요.",
    description: "잠시 후 다시 확인해주세요.",
    primaryLabel: "다시 시도",
    secondaryLabel: "취소",
    action: "retry",
    variant: "info",
  },
};

export function getErrorMessage(
  code: string,
  overrides?: Partial<ErrorMessageInfo>,
): ErrorMessageInfo {
  return {
    ...(errorMessageMap[code] ?? DEFAULT_ERROR_MESSAGE),
    ...overrides,
  };
}
