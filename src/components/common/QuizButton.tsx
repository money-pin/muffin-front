type QuizState = "default" | "selected" | "correct" | "wrong";

interface QuizButtonProps {
  label: string;
  state?: QuizState;
  onClick?: () => void;
}

export default function QuizButton({ label, state = "default", onClick }: QuizButtonProps) {
  const styles: Record<QuizState, string> = {
    default: "border-neutral-100 bg-white text-neutral-900 text-body-16-md-tighter",
    selected: "border-primary-300 bg-primary-50 text-primary text-body-16-bd-tighter",
    correct: "border-primary-300 bg-primary-50 text-primary text-body-16-bd-tighter",
    wrong: "border-positive-300 bg-positive-50 text-positive text-body-16-bd-tighter",
  };

  return (
    <button
      onClick={onClick}
      className={`w-full h-[58px] flex items-center justify-center rounded-[8px] border transition-all ${styles[state]}`}
    >
      {label}
    </button>
  );
}
