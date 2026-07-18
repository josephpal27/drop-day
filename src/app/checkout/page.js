"use client";

import Link from "next/link";
import CheckoutSummary from "@/components/CheckoutSummary";

export default function CheckoutPage() {
  return (
    <main className="min-h-screen max-w-xl mx-auto px-4 sm:px-6 py-8">
      <Link href="/" className="inline-block text-xs font-mono text-[var(--ink-muted)] hover:text-[var(--ink)] mb-4">
        ← Back to Drop
      </Link>
      <p className="font-mono text-[10px] tracking-[0.25em] text-[var(--stamp-red)] mb-1.5">CHECKOUT</p>
      <h1 className="font-display text-3xl font-black uppercase text-[var(--ink)] mb-6 tracking-tight">
        Confirm Your Order
      </h1>
      <CheckoutSummary />
    </main>
  );
}