interface RankingSectionHeaderProps {
  iconSrc: string;
  title: string;
  weekLabel: string;
}

export default function RankingSectionHeader({
  iconSrc,
  title,
  weekLabel,
}: RankingSectionHeaderProps) {
  return (
    <div className="flex items-center justify-between px-5">
      <div className="flex min-w-0 items-center gap-1">
        <img
          src={iconSrc}
          alt=""
          aria-hidden="true"
          className="size-5 shrink-0"
          draggable={false}
        />
        <h2 className="truncate text-body-16-bd-tighter text-neutral-900">
          {title}
        </h2>
      </div>

      <p className="shrink-0 text-caption-12-md text-neutral-400">
        {weekLabel}
      </p>
    </div>
  );
}
