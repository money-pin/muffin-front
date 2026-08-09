interface StorageEmptyStateProps {
  title: string;
  description: string;
}

export default function StorageEmptyState({
  title,
  description,
}: StorageEmptyStateProps) {
  return (
    <div className="flex h-[148px] w-full items-center justify-center px-5 text-center">
      <p className="text-body-14-md-tighter text-neutral-400">
        {title}
        <br />
        {description}
      </p>
    </div>
  );
}
