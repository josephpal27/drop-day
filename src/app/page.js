"use client";

import DropGrid from "@/components/DropGrid";
import CartPanel from "@/components/CartPanel";

export default function Home() {
  return (
    <main className="min-h-screen max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <header className="flex items-end justify-between mb-8 pb-5 border-b border-dashed border-[var(--line)]">
        <div>
          <p className="font-mono text-[10px] tracking-[0.25em] text-[var(--stamp-red)] mb-1.5">
            ● LIVE DROP
          </p>
          <h1 className="font-display text-4xl font-black uppercase text-[var(--ink)] tracking-tight">Drop Day</h1>
        </div>
        <span className="hidden sm:flex items-center gap-2 text-[10px] text-[var(--ink-muted)] font-mono tracking-widest uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--go)] animate-pulse" />
          stock updates live
        </span>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        <DropGrid />
        <CartPanel />
      </div>
    </main>
  );
}