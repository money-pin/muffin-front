type QuizState = "default" | "selected" | "correct" | "wrong";

interface QuizButtonProps {
  label: string;
  state?: QuizState;
  onClick?: () => void;
}

export default function QuizButton({ label, state = "default", onClick }: QuizButtonProps) {
  const styles: Record<QuizState, string> = {
    default: "border-neutral-100 bg-white text-neutral-900",
    selected: "border-primary bg-primary-50 text-primary",
    correct: "border-negative-300 bg-negative-50 text-negative-300",
    wrong: "border-positive-300 bg-positive-50 text-positive-300",
  };

  return (
    <button
      onClick={onClick}
      className={`w-full h-[58px] flex items-center justify-center rounded-[8px] text-body-16-bd-tighter border transition-all ${styles[state]}`}
    >
      {label}
    </button>
  );
}
