"use client";
import { useEffect, useState } from "react";
import { useDropStore } from "@/context/DropContext";

const HOLD_MS = 60000;

export default function HoldTimer({ hold }) {
    const { releaseHold } = useDropStore();
    const [now, setNow] = useState(Date.now());
    const [justExpired, setJustExpired] = useState(false);

    useEffect(() => {
        const t = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(t);
    }, []);

    const remaining = hold.expiresAt - now;
    const panicMode = remaining > 0 && remaining <= 10000;
    const pct = Math.max(0, Math.min(100, (remaining / HOLD_MS) * 100));

    const barColor =
        remaining <= 10000 ? "var(--danger)" : remaining <= 25000 ? "var(--warning)" : "var(--accent)";

    useEffect(() => {
        if (remaining <= 0 && !justExpired) setJustExpired(true);
    }, [remaining, justExpired]);

    if (justExpired) {
        return (
            <div className="rounded-lg border border-[color-mix(in_srgb,var(--danger)_40%,transparent)] bg-[color-mix(in_srgb,var(--danger)_10%,transparent)] p-3 text-xs font-mono text-[var(--danger)]">
                Hold expired — {hold.productName} released back to stock
            </div>
        );
    }

    const seconds = Math.max(0, Math.ceil(remaining / 1000));

    return (
        <div
            className={`rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-3 overflow-hidden ${panicMode ? "animate-panic" : ""
                }`}
        >
            <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-[var(--text-primary)]">{hold.productName}</p>
                <button
                    onClick={() => releaseHold(hold.id)}
                    className="text-[10px] font-mono text-[var(--text-muted)] hover:text-[var(--text-secondary)] tracking-widest"
                >
                    RELEASE
                </button>
            </div>
            <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-mono tracking-widest text-[var(--text-muted)]">EXPIRES</span>
                <span className="font-mono text-sm font-bold" style={{ color: barColor }}>
                    00:{seconds.toString().padStart(2, "0")}
                </span>
            </div>
            <div className="h-1 rounded-full bg-[var(--border)] overflow-hidden">
                <div
                    className="h-full rounded-full transition-all duration-1000 ease-linear"
                    style={{ width: `${pct}%`, background: barColor }}
                />
            </div>
        </div>
    );
}