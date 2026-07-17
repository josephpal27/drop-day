export default function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 animate-pulse">
          <div className="h-32 bg-[var(--surface-2)] rounded-lg mb-3" />
          <div className="h-4 bg-[var(--surface-2)] rounded w-3/4 mb-2" />
          <div className="h-4 bg-[var(--surface-2)] rounded w-1/2" />
        </div>
      ))}
    </div>
  );
}