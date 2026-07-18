"use client";

import Link from "next/link";
import { useDropStore } from "@/context/DropContext";
import { formatINR } from "@/lib/format";

export default function CheckoutSummary() {
    const { holds, checkout, confirmCheckout } = useDropStore();

    if (checkout.state === "success") {
        return (
            <div className="rounded-xl border border-[var(--go)] bg-[color-mix(in_srgb,var(--go)_5%,white)] p-6 text-center">
                <span className="inline-block border-2 border-[var(--go)] text-[var(--go)] font-mono font-bold text-xs tracking-widest px-3 py-1 rounded -rotate-3 mb-3">
                    CONFIRMED
                </span>
                <p className="font-display font-bold text-lg text-[var(--ink)] mb-1 uppercase">Order confirmed</p>
                <p className="text-sm font-mono text-[var(--ink-muted)] mb-4">ORDER NO. {checkout.orderId}</p>
                <Link href="/" className="text-sm underline text-[var(--ink-muted)] hover:text-[var(--ink)]">
                    Back to Drop
                </Link>
            </div>
        );
    }

    if (holds.length === 0 && checkout.state === "idle") {
        return (
            <div className="rounded-xl border border-[var(--line)] bg-[var(--paper)] p-6 text-center">
                <p className="text-[var(--ink-muted)] mb-3">No active tickets to check out.</p>
                <Link href="/" className="text-sm underline text-[var(--ink-muted)] hover:text-[var(--ink)]">
                    Back to Drop
                </Link>
            </div>
        );
    }

    const total = holds.reduce((sum, h) => sum + h.price, 0);

    return (
        <div className="rounded-xl border border-[var(--line)] bg-[var(--paper)] p-6 flex flex-col gap-4">
            <p className="font-display font-bold text-sm tracking-widest uppercase text-[var(--ink)]">Order Summary</p>

            <div className="flex flex-col gap-2 font-mono text-sm">
                {holds.map((h) => (
                    <div key={h.id} className="flex justify-between">
                        <span className="text-[var(--ink-muted)]">{h.productName}</span>
                        <span className="text-[var(--ink)] font-semibold">{formatINR(h.price)}</span>
                    </div>
                ))}
            </div>

            <div className="flex justify-between text-sm font-bold border-t border-dashed border-[var(--line)] pt-3 font-mono">
                <span className="text-[var(--ink)]">TOTAL</span>
                <span className="text-[var(--ink)]">{formatINR(total)}</span>
            </div>

            {checkout.state === "failed" && (
                <div className="rounded-lg border border-[var(--stamp-red)] bg-[color-mix(in_srgb,var(--stamp-red)_6%,white)] p-3 text-sm text-[var(--stamp-red)]">
                    {checkout.error === "HOLD_EXPIRED_MID_CHECKOUT"
                        ? "One of your held items expired during checkout. Please review your cart and try again."
                        : "Checkout failed — please try again."}
                </div>
            )}

            <button
                onClick={() => confirmCheckout(holds.map((h) => h.id))}
                disabled={checkout.state === "confirming" || holds.length === 0}
                className="px-4 py-2.5 rounded-lg bg-[var(--ink)] text-white text-sm font-semibold disabled:opacity-40 hover:-translate-y-0.5 transition-transform duration-150"
            >
                {checkout.state === "confirming" ? "Confirming…" : "Confirm Order"}
            </button>
        </div>
    );
}