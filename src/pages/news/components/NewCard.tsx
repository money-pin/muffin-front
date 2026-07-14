export default function NewsCard() {
  return (
    <div className="w-full max-w-[350px] min-h-[88px] flex items-start gap-[12px] p-4 bg-white border border-neutral-100 rounded-[16px] shadow-sm">
      <div className="w-[56px] h-[56px] bg-neutral-200 rounded-[12px] flex-shrink-0" />

      <div className="flex-1 flex flex-col gap-[8px]">
        <div className="flex justify-between items-start gap-2">
          <div className="w-full flex flex-col gap-1.5">
            <div className="w-11/12 h-4 bg-neutral-200 rounded animate-pulse" />
            <div className="w-2/3 h-4 bg-neutral-200 rounded animate-pulse" />
          </div>
          <div className="w-5 h-5 bg-neutral-200 rounded flex-shrink-0" />
        </div>

        <div className="flex items-center gap-[8px]">
          <div className="w-12 h-5 bg-neutral-200 rounded-[4px]" />
          <div className="w-10 h-3 bg-neutral-200 rounded" />
          <div className="w-16 h-3 bg-neutral-200 rounded" />
        </div>
      </div>
    </div>
  );
}