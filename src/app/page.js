"use client";
import DropGrid from "@/components/DropGrid";
import CartPanel from "@/components/CartPanel";

export default function Home() {
  return (
    <main className="min-h-screen max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <header className="flex items-center justify-between mb-8">
        <div>
          <p className="font-mono text-xs tracking-widest text-[var(--accent)] mb-1">LIVE DROP</p>
          <h1 className="font-display text-3xl font-bold">Drop Day</h1>
        </div>
        <span className="hidden sm:flex items-center gap-2 text-xs text-[var(--text-muted)] font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
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