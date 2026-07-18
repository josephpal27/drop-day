export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center rounded-xl border border-dashed border-[var(--line)] bg-[var(--paper)]">
      <p className="font-display text-lg font-bold uppercase text-[var(--ink)] mb-2">No drops right now</p>
      <p className="text-sm text-[var(--ink-muted)]">
        Check back soon — new products go live regularly.
      </p>
    </div>
  );
}