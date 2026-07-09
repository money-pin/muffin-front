interface SettingToggleProps {
  checked: boolean;
  onToggle: () => void;
  label: string; // 접근성용 — 화면에는 행 라벨이 별도로 표시됨
}

// Figma 설정 알림 토글: on = primary, off = 회색
export default function SettingToggle({
  checked,
  onToggle,
  label,
}: SettingToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onToggle}
      className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${
        checked ? "bg-primary" : "bg-neutral-400"
      }`}
    >
      <span
        className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-all ${
          checked ? "left-6" : "left-1"
        }`}
      />
    </button>
  );
}
