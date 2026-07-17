export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center rounded-xl border border-[var(--border)] bg-[var(--surface)]">
      <p className="font-display text-lg font-bold mb-2">No drops right now</p>
      <p className="text-sm text-[var(--text-secondary)]">
        Check back soon — new products go live regularly.
      </p>
    </div>
  );
}