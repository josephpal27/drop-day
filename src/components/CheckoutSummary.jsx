"use client";
import Link from "next/link";
import { useDropStore } from "@/context/DropContext";

export default function CheckoutSummary() {
    const { holds, checkout, confirmCheckout } = useDropStore();

    if (checkout.state === "success") {
        return (
            <div className="rounded-xl border border-[color-mix(in_srgb,var(--accent)_35%,transparent)] bg-[color-mix(in_srgb,var(--accent)_8%,transparent)] p-6 text-center">
                <p className="font-display font-bold text-lg text-[var(--accent)] mb-1">Order confirmed</p>
                <p className="text-sm font-mono text-[var(--text-secondary)] mb-4">
                    Order ID: {checkout.orderId}
                </p>
                <Link href="/" className="text-sm underline text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                    Back to drop
                </Link>
            </div>
        );
    }

    if (holds.length === 0 && checkout.state === "idle") {
        return (
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 text-center">
                <p className="text-[var(--text-secondary)] mb-3">No active holds to check out.</p>
                <Link href="/" className="text-sm underline text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                    Back to drop
                </Link>
            </div>
        );
    }

    const total = holds.reduce((sum, h) => sum + h.price, 0);

    return (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 flex flex-col gap-4">
            <p className="font-display font-bold text-sm tracking-wide">Order summary</p>

            <div className="flex flex-col gap-2">
                {holds.map((h) => (
                    <div key={h.id} className="flex justify-between text-sm">
                        <span className="text-[var(--text-secondary)]">{h.productName}</span>
                        <span className="font-mono text-[var(--text-primary)]">${h.price}</span>
                    </div>
                ))}
            </div>

            <div className="flex justify-between text-sm font-semibold border-t border-[var(--border)] pt-3">
                <span>Total</span>
                <span className="font-mono">${total}</span>
            </div>

            {checkout.state === "failed" && (
                <div className="rounded-lg border border-[color-mix(in_srgb,var(--danger)_40%,transparent)] bg-[color-mix(in_srgb,var(--danger)_10%,transparent)] p-3 text-sm text-[var(--danger)]">
                    {checkout.error === "HOLD_EXPIRED_MID_CHECKOUT"
                        ? "One of your held items expired during checkout. Please review your cart and try again."
                        : "Checkout failed — please try again."}
                </div>
            )}

            <button
                onClick={() => confirmCheckout(holds.map((h) => h.id))}
                disabled={checkout.state === "confirming" || holds.length === 0}
                className="px-4 py-2 rounded-lg bg-[var(--accent)] text-[var(--accent-ink)] text-sm font-semibold disabled:opacity-40 hover:brightness-95 transition"
            >
                {checkout.state === "confirming" ? "Confirming…" : "Confirm order"}
            </button>
        </div>
    );
}