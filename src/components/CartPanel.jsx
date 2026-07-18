"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useDropStore } from "@/context/DropContext";
import HoldTimer from "./HoldTimer";

export default function CartPanel() {
    const { holds, resetCheckout, notice, clearNotice } = useDropStore();

    useEffect(() => {
        if (!notice) return;
        const t = setTimeout(clearNotice, 3000);
        return () => clearTimeout(t);
    }, [notice, clearNotice]);

    return (
        <aside className="rounded-xl border border-[var(--line)] bg-[var(--paper-2)] p-4 flex flex-col gap-3 h-fit sticky top-4">
            <div className="flex items-center justify-between">
                <p className="font-display font-bold text-sm tracking-widest uppercase text-[var(--ink)]">Your tickets</p>
                {holds.length > 0 && (
                    <span className="font-mono text-xs font-bold text-[var(--ink)] bg-[var(--paper)] border border-[var(--line)] rounded px-1.5 py-0.5">
                        {holds.length}
                    </span>
                )}
            </div>

            {notice && (
                <div
                    className={`rounded-lg border p-2.5 text-xs font-mono ${notice.type === "error"
                        ? "border-[var(--stamp-red)] bg-[color-mix(in_srgb,var(--stamp-red)_6%,white)] text-[var(--stamp-red)]"
                        : "border-[var(--line)] bg-[var(--paper)] text-[var(--ink-muted)]"
                        }`}
                >
                    {notice.text}
                </div>
            )}

            {holds.length === 0 && (
                <p className="text-sm text-[var(--ink-muted)]">
                    No tickets yet - add items to hold it for 60s.
                </p>
            )}

            <div className="flex flex-col gap-3">
                {holds.map((h) => (
                    <HoldTimer key={h.id} hold={h} />
                ))}
            </div>

            {holds.length > 0 && (
                <Link
                    href="/checkout"
                    onClick={resetCheckout}
                    className="mt-1 px-3 py-2.5 rounded-lg bg-[var(--ink)] text-white text-sm font-semibold text-center hover:-translate-y-0.5 transition-transform duration-150"
                >
                    Proceed to checkout
                </Link>
            )}
        </aside>
    );
}