"use client";

import { useState } from "react";
import { useDropStore } from "@/context/DropContext";
import CountdownBadge from "./CountdownBadge";
import { formatINR } from "@/lib/format";

export default function ProductCard({ product }) {
    const { placeHold } = useDropStore();
    const [pending, setPending] = useState(false);
    const [message, setMessage] = useState(null);
    const [imgError, setImgError] = useState(false);

    const highDemand = product.watchers > 15;
    const lowStock = product.status === "live" && product.stock > 0 && product.stock <= 2;
    const soldOut = product.status === "sold_out";
    // const imageUrl = `https://picsum.photos/seed/${product.image}/600/400`;
    const imageUrl = `/images/${product.image}.jpg`;

    async function handleAddToCart() {
        setPending(true);
        setMessage(null);
        try {
            await placeHold(product.id);
            setMessage({ type: "success", text: "Ticket issued - held 60s" });
        } catch (e) {
            if (e.message === "OUT_OF_STOCK") {
                setMessage({ type: "error", text: "Just sold out - someone got there first" });
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
            className={`group rounded-xl border bg-[var(--paper)] overflow-hidden flex flex-col transition-transform duration-150 ${soldOut ? "border-[var(--line)] opacity-70" : "border-[var(--line)] hover:border-[var(--ink-faint)] hover:-translate-y-0.5"
                }`}
        >
            <div className="relative w-full aspect-[3/2] bg-[var(--paper-2)] overflow-hidden">
                {!imgError ? (
                    <img
                        src={imageUrl}
                        alt={product.name}
                        onError={() => setImgError(true)}
                        loading="lazy"
                        className={`w-full h-full object-cover ${soldOut ? "grayscale opacity-60" : ""}`}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <span className="font-display text-sm text-[var(--ink-faint)] px-4 text-center uppercase tracking-wide">
                            {product.name}
                        </span>
                    </div>
                )}

                {product.status === "live" && (
                    <span className="absolute top-2.5 left-2.5 inline-flex items-center gap-1.5 rounded border border-[var(--go)] bg-[color-mix(in_srgb,var(--go)_10%,white)] px-2 py-1 text-[10px] font-mono font-bold tracking-widest text-[var(--go)] -rotate-3">
                        ● LIVE
                    </span>
                )}
                {soldOut && (
                    <span className="absolute top-2.5 left-2.5 inline-flex items-center rounded border-2 border-[var(--stamp-red)] bg-[color-mix(in_srgb,var(--stamp-red)_8%,white)] px-2 py-1 text-[10px] font-mono font-bold tracking-widest text-[var(--stamp-red)] -rotate-6">
                        SOLD OUT
                    </span>
                )}
                {highDemand && product.status === "live" && (
                    <span className="absolute top-2.5 right-2.5 rounded bg-[var(--ink)]/85 backdrop-blur px-2 py-1 text-[10px] font-mono text-white">
                        {product.watchers} watching
                    </span>
                )}
            </div>

            <div className="p-4 flex flex-col gap-3 flex-1">
                <div>
                    <p className="font-display font-bold text-[var(--ink)] leading-tight uppercase tracking-wide">
                        {product.name}
                    </p>
                    <p className="text-base text-[var(--ink)] font-mono font-bold mt-1">{formatINR(product.price)}</p>
                </div>

                {product.status === "live" && (
                    <>
                        <p className="text-xs font-mono">
                            <span className={lowStock ? "text-[var(--stamp-red)] font-semibold" : "text-[var(--ink-muted)]"}>
                                {product.stock} left
                            </span>
                            {lowStock && <span className="text-[var(--stamp-red)]"> - almost gone</span>}
                        </p>
                        <button
                            onClick={handleAddToCart}
                            disabled={pending || product.stock < 1}
                            className="mt-auto px-3 py-2.5 rounded-lg bg-[var(--ink)] text-white text-sm font-semibold disabled:opacity-40 hover:-translate-y-0.5 transition-transform duration-150"
                        >
                            {pending ? "Issuing Ticket…" : "Add to Cart"}
                        </button>
                        {message && (
                            <p
                                className={`text-xs font-mono ${message.type === "error" ? "text-[var(--stamp-red)]" : "text-[var(--go)]"
                                    }`}
                            >
                                {message.text}
                            </p>
                        )}
                    </>
                )}

                {product.status === "dropping_soon" && <CountdownBadge dropTime={product.dropTime} />}

                {soldOut && (
                    <span className="mt-auto text-xs font-mono tracking-widest text-[var(--ink-faint)]">
                        Currently unavailable
                    </span>
                )}
            </div>
        </div>
    );
}