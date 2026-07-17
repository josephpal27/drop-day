"use client";
import { useDropStore } from "@/context/DropContext";

export default function ErrorState() {
  const { refresh } = useDropStore();
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center rounded-xl border border-[var(--border)] bg-[var(--surface)]">
      <p className="font-display text-lg font-bold text-[var(--text-primary)] mb-2">
        Something went wrong
      </p>
      <p className="text-sm text-[var(--text-secondary)] mb-5 max-w-xs">
        We couldn't load the drop right now. This can happen — try again.
      </p>
      <button
        onClick={refresh}
        className="px-4 py-2 rounded-lg bg-[var(--accent)] text-[var(--accent-ink)] text-sm font-semibold hover:brightness-95 transition"
      >
        Retry
      </button>
    </div>
  );
}