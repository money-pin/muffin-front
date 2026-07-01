interface OnboardingButtonProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

export default function OnboardingButton({ label, selected, onClick }: OnboardingButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full h-[52px] flex items-center justify-center rounded-[8px] text-body-16-bd-tighter border transition-all
        ${
          selected
            ? "border-primary bg-primary-50 text-primary"
            : "border-neutral-100 bg-white text-neutral-700"
        }`}
    >
      {label}
    </button>
  );
}
