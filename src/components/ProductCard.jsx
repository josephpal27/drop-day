"use client";
import { useState } from "react";
import { useDropStore } from "@/context/DropContext";
import CountdownBadge from "./CountdownBadge";

export default function ProductCard({ product }) {
    const { placeHold } = useDropStore();
    const [pending, setPending] = useState(false);
    const [message, setMessage] = useState(null);

    const highDemand = product.watchers > 15;
    const lowStock = product.status === "live" && product.stock > 0 && product.stock <= 2;
    const soldOut = product.status === "sold_out";

    async function handleAddToCart() {
        setPending(true);
        setMessage(null);
        try {
            await placeHold(product.id);
            setMessage({ type: "success", text: "Added — held for 60s" });
        } catch (e) {
            if (e.message === "OUT_OF_STOCK") {
                setMessage({ type: "error", text: "Just sold out — someone got there first" });
            } else {
                setMessage({ type: "error", text: "Couldn't add right now, try again" });
            }
        } finally {
            setPending(false);
            setTimeout(() => setMessage(null), 3000);
        }
    }

    return (
        <div
            className={`group rounded-xl border bg-[var(--surface)] p-4 flex flex-col gap-3 transition ${soldOut ? "border-[var(--border)] opacity-50" : "border-[var(--border)] hover:border-[var(--text-muted)]"
                }`}
        >
            <div className="relative h-32 rounded-lg bg-[var(--surface-2)] flex items-center justify-center overflow-hidden">
                <span className="font-display text-sm text-[var(--text-muted)] px-4 text-center">
                    {product.name}
                </span>

                <span className="absolute top-2 left-2 flex items-center gap-1.5">
                    {product.status === "live" && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-black/50 backdrop-blur px-2 py-0.5 text-[10px] font-mono tracking-widest text-[var(--accent)]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
                            LIVE
                        </span>
                    )}
                </span>

                {highDemand && product.status === "live" && (
                    <span className="absolute top-2 right-2 rounded-full bg-black/50 backdrop-blur px-2 py-0.5 text-[10px] font-mono text-[var(--danger)]">
                        {product.watchers} watching
                    </span>
                )}
            </div>

            <div className="flex items-start justify-between gap-2">
                <div>
                    <p className="font-display font-bold text-[var(--text-primary)] leading-tight">{product.name}</p>
                    <p className="text-sm text-[var(--text-secondary)] font-mono mt-0.5">${product.price}</p>
                </div>
            </div>

            {product.status === "live" && (
                <>
                    <p className="text-xs font-mono">
                        <span className={lowStock ? "text-[var(--danger)] font-semibold" : "text-[var(--text-secondary)]"}>
                            {product.stock} left
                        </span>
                        {lowStock && <span className="text-[var(--danger)]"> — almost gone</span>}
                    </p>
                    <button
                        onClick={handleAddToCart}
                        disabled={pending || product.stock < 1}
                        className="px-3 py-2 rounded-lg bg-[var(--accent)] text-[var(--accent-ink)] text-sm font-semibold disabled:opacity-40 hover:brightness-95 transition"
                    >
                        {pending ? "Adding…" : "Add to cart"}
                    </button>
                    {message && (
                        <p
                            className={`text-xs font-mono ${message.type === "error" ? "text-[var(--danger)]" : "text-[var(--accent)]"
                                }`}
                        >
                            {message.text}
                        </p>
                    )}
                </>
            )}

            {product.status === "dropping_soon" && <CountdownBadge dropTime={product.dropTime} />}

            {soldOut && (
                <span className="text-xs font-mono tracking-widest text-[var(--text-muted)]">SOLD OUT</span>
            )}
        </div>
    );
}