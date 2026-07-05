import Button from "@/components/common/Button";
import TextField from "@/components/common/TextField";

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
  const canSubmit = nickname.trim() !== "";

  return (
    <div className="flex flex-1 flex-col px-5 pb-8 pt-5">
      <div className="text-heading-20-bd text-neutral-1000">
        <p>가입이 완료됐어요!</p>
        <p>앞으로 사용할 닉네임을 설정해 주세요.</p>
      </div>

      <div className="mt-9">
        <TextField
          placeholder="최대 6자 설정 가능"
          hint="나중에 언제든지 변경할 수 있어요."
          maxLength={6}
          value={nickname}
          onChange={onChange}
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
