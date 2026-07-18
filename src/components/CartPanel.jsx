"use client";
import { useEffect } from "react";
import Link from "next/link";
import { useDropStore } from "@/context/DropContext";
import HoldTimer from "./HoldTimer";

export default function CartPanel() {
    const { holds, resetCheckout, notice, clearNotice } = useDropStore();

    // auto-dismiss the release-failed notice after 3s
    useEffect(() => {
        if (!notice) return;
        const t = setTimeout(clearNotice, 3000);
        return () => clearTimeout(t);
    }, [notice, clearNotice]);

    return (
        <aside className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 flex flex-col gap-3 h-fit sticky top-4">
            <div className="flex items-center justify-between">
                <p className="font-display font-bold text-sm tracking-wide">Your holds</p>
                {holds.length > 0 && (
                    <span className="font-mono text-xs text-[var(--accent)]">{holds.length}</span>
                )}
            </div>

            {notice && (
                <div
                    className={`rounded-lg border p-2.5 text-xs font-mono ${notice.type === "error"
                        ? "border-[color-mix(in_srgb,var(--danger)_40%,transparent)] bg-[color-mix(in_srgb,var(--danger)_10%,transparent)] text-[var(--danger)]"
                        : "border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-secondary)]"
                        }`}
                >
                    {notice.text}
                </div>
            )}

            {holds.length === 0 && (
                <p className="text-sm text-[var(--text-secondary)]">
                    Nothing held yet — add an item to start a 60s hold.
                </p>
            )}

            <div className="flex flex-col gap-2">
                {holds.map((h) => (
                    <HoldTimer key={h.id} hold={h} />
                ))}
            </div>

            {holds.length > 0 && (
                <Link
                    href="/checkout"
                    onClick={resetCheckout}
                    className="mt-1 px-3 py-2 rounded-lg bg-[var(--accent)] text-[var(--accent-ink)] text-sm font-semibold text-center hover:brightness-95 transition"
                >
                    Proceed to checkout
                </Link>
            )}
        </aside>
    );
}