"use client";
import Link from "next/link";
import { useDropStore } from "@/context/DropContext";
import HoldTimer from "./HoldTimer";

export default function CartPanel() {
    const { holds } = useDropStore();

    return (
        <aside className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 flex flex-col gap-3 h-fit sticky top-4">
            <div className="flex items-center justify-between">
                <p className="font-display font-bold text-sm tracking-wide">Your holds</p>
                {holds.length > 0 && (
                    <span className="font-mono text-xs text-[var(--accent)]">{holds.length}</span>
                )}
            </div>

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
                    className="mt-1 px-3 py-2 rounded-lg bg-[var(--accent)] text-[var(--accent-ink)] text-sm font-semibold text-center hover:brightness-95 transition"
                >
                    Proceed to checkout
                </Link>
            )}
        </aside>
    );
}