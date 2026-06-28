interface OnboardingButtonProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

export default function OnboardingButton({ label, selected, onClick }: OnboardingButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full h-[52px] flex items-center justify-center rounded-[8px] text-sm font-bold border transition-all
        ${
          selected
            ? "border-[#F46C0E] bg-[#FFF4EA] text-[#F46C0E]"
            : "border-[#E2E2E2] bg-white text-[#535353]"
        }`}
    >
      {label}
    </button>
  );
}
