"use client";

import { useEffect, useState } from "react";

function format(ms) {
    if (ms <= 0) return "00:00";
    const totalSec = Math.floor(ms / 1000);
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export default function CountdownBadge({ dropTime }) {
    const [now, setNow] = useState(Date.now());

    useEffect(() => {
        const t = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(t);
    }, []);

    const remaining = dropTime - now;

    return (
        <div className="inline-flex items-center gap-2 rounded-md bg-[color-mix(in_srgb,var(--amber)_10%,white)] border border-[var(--amber)] px-2.5 py-1.5 w-full">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--amber)]" />
            <span className="text-[10px] tracking-widest text-[var(--amber)] font-mono font-bold">DROPS IN</span>
            <span className="font-mono text-sm font-bold text-[var(--amber)]">{format(remaining)}</span>
        </div>
    );
}