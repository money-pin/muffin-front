interface TabOption<T extends string = string> {
  value: T;
  label: string;
}

interface TabBarProps<T extends string = string> {
  tabs: readonly TabOption<T>[];
  currentTab: T;
  onTabChange: (value: T) => void;
  className?: string;
}

export default function TabBar<T extends string = string>({
  tabs,
  currentTab,
  onTabChange,
  className = "",
}: TabBarProps<T>) {
  return (
    <nav className={`flex h-12 w-full items-center bg-neutral-0 ${className}`}>
      {tabs.map((tab) => {
        const isActive = tab.value === currentTab;

        return (
          <button
            key={tab.value}
            type="button"
            aria-current={isActive ? "page" : undefined}
            onClick={() => onTabChange(tab.value)}
            className="relative flex h-full flex-1 items-center justify-center px-2.5 py-3"
          >
            <span
              className={
                isActive
                  ? "text-body-16-bd-tighter text-primary"
                  : "text-body-16-md-tighter text-neutral-400"
              }
            >
              {tab.label}
            </span>

            <span
              aria-hidden="true"
              className={`absolute bottom-0 h-0.5 w-full ${
                isActive ? "bg-primary" : "bg-transparent"
              }`}
            />
          </button>
        );
      })}
    </nav>
  );
}
