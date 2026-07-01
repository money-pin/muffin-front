interface TabOption<T extends string = string> {
  value: T;
  label: string;
}

interface TabBarProps<T extends string = string> {
  tabs: TabOption<T>[];
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
    <div className={`w-full bg-white border-b border-neutral-100 ${className}`}>
      <div className="flex justify-between items-center px-4">
        {tabs.map((tab) => {
          const isActive = tab.value === currentTab;

          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => onTabChange(tab.value)}
              className="relative flex-1 flex flex-col items-center justify-center h-[48px] focus:outline-none bg-transparent"
            >
              <span
                className={`text-sm font-bold transition-colors duration-200
                  ${isActive ? "text-neutral-900" : "text-neutral-400"}`}
              >
                {tab.label}
              </span>

              <div
                className={`absolute bottom-0 left-0 right-0 h-[2px] transition-all duration-200
                  ${isActive ? "bg-primary" : "bg-transparent"}`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}