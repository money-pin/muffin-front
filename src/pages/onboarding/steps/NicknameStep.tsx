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
    <div className="flex flex-1 flex-col px-5 pb-8 pt-4">
      <div className="flex flex-col gap-2">
        <h2 className="text-heading-20-bd text-neutral-1000">
          가입이 완료됐어요!
        </h2>
        <p className="text-body-14-rg text-neutral-600">
          앞으로 사용할 닉네임을 설정해 주세요.
        </p>
      </div>

      <div className="mt-8">
        <TextField
          label="닉네임"
          placeholder="닉네임을 입력해주세요"
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
