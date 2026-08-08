import Button from "@/components/common/Button";
import TextField from "@/components/common/TextField";
import {
  getNicknameFormatStatus,
  NICKNAME_INVALID_TEXT,
  NICKNAME_MAX_LENGTH,
} from "@/lib/nickname";

interface NicknameStepProps {
  nickname: string;
  onChange: (value: string) => void;
  onNext: () => void;
}

export default function NicknameStep({
  nickname,
  onChange,
  onNext,
}: NicknameStepProps) {
  // 형식(2~6자·특수문자 제외)이 유효할 때만 다음 단계로 진행 가능. 중복은 서버에서 처리.
  const formatStatus = getNicknameFormatStatus(nickname);
  const canSubmit = formatStatus === "valid";

  return (
    <div className="flex flex-1 flex-col px-5 pt-5 pb-8">
      <div className="text-heading-20-bd text-neutral-1000 break-keep">
        <p>가입이 완료됐어요!</p>
        <p>앞으로 사용할 닉네임을 설정해 주세요.</p>
      </div>

      <div className="mt-9">
        <TextField
          placeholder="최대 6자 설정 가능"
          hint="나중에 언제든지 변경할 수 있어요."
          error={formatStatus === "invalid" ? NICKNAME_INVALID_TEXT : undefined}
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
