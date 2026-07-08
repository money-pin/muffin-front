import Button from "@/components/common/Button";
import OnboardingButton from "@/components/common/OnboardingButton";
import type { OnboardingQuestion } from "../onboardingData";

interface QuestionStepProps {
  number: number; // 1-based (Q1, Q2, ...)
  question: OnboardingQuestion;
  selected?: string;
  onSelect: (option: string) => void;
  onNext: () => void;
}

export default function QuestionStep({
  number,
  question,
  selected,
  onSelect,
  onNext,
}: QuestionStepProps) {
  return (
    <div className="flex flex-1 flex-col px-5 pb-8 pt-10">
      <div className="flex flex-col items-center gap-3 text-center">
        <span className="text-heading-24-md text-primary">Q{number}</span>
        <h2 className="text-heading-20-bd text-neutral-1000">
          {question.question}
        </h2>
      </div>

      <div className="mt-11 flex flex-col gap-3">
        {question.options.map((option) => (
          <OnboardingButton
            key={option}
            label={option}
            selected={selected === option}
            onClick={() => onSelect(option)}
          />
        ))}
      </div>

      <div className="mt-auto">
        <Button onClick={onNext} disabled={!selected}>
          다음
        </Button>
      </div>
    </div>
  );
}
