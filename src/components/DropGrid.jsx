"use client";
import { useDropStore } from "@/context/DropContext";
import ProductCard from "./ProductCard";
import LoadingSkeleton from "./LoadingSkeleton";
import ErrorState from "./ErrorState";
import EmptyState from "./EmptyState";

export default function DropGrid() {
  const { products, status } = useDropStore();

  // FIX: only show the full-page error state when we have nothing to show yet
  // (initial load failure). A background poll failure (12% fail rate every
  // 5s) should not tear down a grid the user is actively looking at —
  // we just keep showing the last good data.
  if (status === "loading" && products.length === 0) return <LoadingSkeleton />;
  if (status === "error" && products.length === 0) return <ErrorState />;
  if (status === "ready" && products.length === 0) return <EmptyState />;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}