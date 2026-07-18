"use client";

import { useDropStore } from "@/context/DropContext";

export default function ErrorState() {
  const { refresh } = useDropStore();
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center rounded-xl border border-[var(--line)] bg-[var(--paper)]">
      <p className="font-display text-lg font-bold uppercase text-[var(--ink)] mb-2">
        Something went wrong
      </p>
      <p className="text-sm text-[var(--ink-muted)] mb-5 max-w-xs">
        We couldn't load the drop right now. This can happen - try again.
      </p>
      <button
        onClick={refresh}
        className="px-4 py-2.5 rounded-lg bg-[var(--ink)] text-white text-sm font-semibold hover:-translate-y-0.5 transition-transform duration-150"
      >
        Retry
      </button>
    </div>
  );
}