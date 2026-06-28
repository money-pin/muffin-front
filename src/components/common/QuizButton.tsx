type QuizState = "default" | "selected" | "correct" | "wrong";

interface QuizButtonProps {
  label: string;
  state?: QuizState;
  onClick?: () => void;
}

export default function QuizButton({ label, state = "default", onClick }: QuizButtonProps) {
  const styles: Record<QuizState, string> = {
    default: "border-[#E2E2E2] bg-white text-[#1B1B1B]",
    selected: "border-[#F46C0E] bg-[#FFF4EA] text-[#F46C0E]",
    correct: "border-[#4DA6FF] bg-[#F3F9FF] text-[#4DA6FF]",
    wrong: "border-[#FF596A] bg-[#FFF3F3] text-[#FF596A]",
  };

  return (
    <button
      onClick={onClick}
      className={`w-full h-[58px] flex items-center justify-center rounded-[8px] text-sm font-bold border transition-all ${styles[state]}`}
    >
      {label}
    </button>
  );
}
