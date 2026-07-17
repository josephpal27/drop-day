"use client";
import CheckoutSummary from "@/components/CheckoutSummary";

export default function CheckoutPage() {
  return (
    <main className="min-h-screen max-w-xl mx-auto px-4 sm:px-6 py-8">
      <p className="font-mono text-xs tracking-widest text-[var(--accent)] mb-1">CHECKOUT</p>
      <h1 className="font-display text-3xl font-bold mb-6">Confirm your order</h1>
      <CheckoutSummary />
    </main>
  );
}