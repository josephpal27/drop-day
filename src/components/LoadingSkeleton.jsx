export default function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="rounded-xl border border-[var(--line)] bg-[var(--paper)] overflow-hidden animate-pulse">
          <div className="aspect-[3/2] bg-[var(--paper-2)]" />
          <div className="p-4 flex flex-col gap-2">
            <div className="h-4 bg-[var(--paper-2)] rounded w-3/4" />
            <div className="h-4 bg-[var(--paper-2)] rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}