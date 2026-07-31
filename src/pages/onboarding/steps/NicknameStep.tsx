import Button from "@/components/common/Button";
import TextField from "@/components/common/TextField";

interface NicknameStepProps {
  nickname: string;
  onChange: (value: string) => void;
  onNext: () => void;
}

// 영문·한글 상관없이 최대 6글자
const MAX_NICKNAME_LENGTH = 6;

export default function NicknameStep({
  nickname,
  onChange,
  onNext,
}: NicknameStepProps) {
  const canSubmit = nickname.trim() !== "";

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
          maxLength={MAX_NICKNAME_LENGTH}
          value={nickname}
          onChange={(v) => onChange(v.slice(0, MAX_NICKNAME_LENGTH))}
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
