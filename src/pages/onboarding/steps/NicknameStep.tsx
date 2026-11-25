import Button from "@/components/common/Button";
import TextField from "@/components/common/TextField";
import { NICKNAME_INVALID_TEXT, NICKNAME_MAX_LENGTH } from "@/lib/nickname";
import {
  useNicknameCheck,
  type NicknameCheckStatus,
} from "@/lib/useNicknameCheck";

interface NicknameStepProps {
  nickname: string;
  onChange: (value: string) => void;
  onNext: () => void;
}

const HINT_TEXT = "나중에 언제든지 변경할 수 있어요.";

// 상태별 안내 (Figma 닉네임 설정: 사용 가능하면 초록 안내)
const ERROR_TEXT: Partial<Record<NicknameCheckStatus, string>> = {
  invalid: NICKNAME_INVALID_TEXT,
  banned: NICKNAME_INVALID_TEXT,
  taken: "이미 사용 중인 닉네임이에요!",
  error: "닉네임 확인에 실패했어요. 다시 입력해주세요.",
};

export default function NicknameStep({
  nickname,
  onChange,
  onNext,
}: NicknameStepProps) {
  // 형식 확인 후 서버 중복 확인까지 통과해야 다음 단계로 진행한다 (#333)
  const status = useNicknameCheck(nickname);
  const canSubmit = status === "available";

  return (
    <div className="flex flex-1 flex-col px-5 pt-5 pb-8">
      <div className="text-heading-20-bd text-neutral-1000 break-keep">
        <p>가입이 완료됐어요!</p>
        <p>앞으로 사용할 닉네임을 설정해 주세요.</p>
      </div>

      <div className="mt-9">
        <TextField
          placeholder="최대 6자 설정 가능"
          hint={status === "checking" ? "닉네임 확인 중이에요..." : HINT_TEXT}
          error={ERROR_TEXT[status]}
          success={canSubmit ? "사용 가능한 닉네임이에요." : undefined}
          maxLength={NICKNAME_MAX_LENGTH}
          value={nickname}
          onChange={(v) => onChange(v.slice(0, NICKNAME_MAX_LENGTH))}
        />
      </div>

      <div className="mt-auto">
        <Button onClick={onNext} disabled={!canSubmit}>
          완료
        </Button>
      </div>
    </div>
  );
}
