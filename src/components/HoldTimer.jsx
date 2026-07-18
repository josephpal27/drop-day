"use client";

import { useEffect, useState } from "react";
import { useDropStore } from "@/context/DropContext";
import { formatINR } from "@/lib/format";

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
    remaining <= 10000 ? "var(--stamp-red)" : remaining <= 25000 ? "var(--amber)" : "var(--go)";

  useEffect(() => {
    if (remaining <= 0 && !justExpired) setJustExpired(true);
  }, [remaining, justExpired]);

  if (justExpired) {
    return (
      <div className="rounded-lg border border-[var(--stamp-red)] bg-[color-mix(in_srgb,var(--stamp-red)_6%,white)] p-3 text-xs font-mono text-[var(--stamp-red)]">
        Ticket expired — {hold.productName} released back to stock
      </div>
    );
  }

  const seconds = Math.max(0, Math.ceil(remaining / 1000));
  const ticketNo = (hold.id.replace(/[^0-9]/g, "") || "0").padStart(6, "0").slice(-6);

  return (
    <div
      className={`relative rounded-lg bg-[var(--paper)] border border-[var(--line)] pl-4 pr-3 py-3 ${panicMode ? "border-[var(--stamp-red)] animate-panic" : ""
        }`}
    >
      <span className="absolute -left-[7px] top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-[var(--paper-2)]" />
      <span className="absolute -right-[7px] top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-[var(--paper-2)]" />

      <div className="flex items-center justify-between mb-1">
        <p className="text-sm font-semibold text-[var(--ink)] font-display uppercase tracking-wide">
          {hold.productName}
        </p>
        <button
          onClick={() => releaseHold(hold)}
          className="text-[10px] font-mono text-[var(--ink-faint)] hover:text-[var(--stamp-red)] tracking-widest"
        >
          RELEASE
        </button>
      </div>

      <div className="flex items-center justify-between text-[10px] font-mono text-[var(--ink-faint)] tracking-widest mb-2">
        <span>NO. {ticketNo}</span>
        <span>{formatINR(hold.price)}</span>
      </div>

      <div className="border-t border-dashed border-[var(--line)] pt-2">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-mono tracking-widest text-[var(--ink-faint)]">EXPIRES</span>
          <span className="font-mono text-sm font-bold" style={{ color: barColor }}>
            00:{seconds.toString().padStart(2, "0")}
          </span>
        </div>
        <div className="h-1 rounded-full bg-[var(--line)] overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000 ease-linear"
            style={{ width: `${pct}%`, background: barColor }}
          />
        </div>
      </div>
    </div>
  );
}