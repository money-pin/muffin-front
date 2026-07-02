interface OnboardingButtonProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

export default function OnboardingButton({ label, selected, onClick }: OnboardingButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full h-[52px] flex items-center justify-center rounded-[8px] border transition-all
        ${
          selected
            ? "border-primary-300 bg-primary-50 text-primary text-body-16-bd-tighter"
            : "border-neutral-100 bg-white text-neutral-900 text-body-16-md-tighter"
        }`}
    >
      {label}
    </button>
  );
}
