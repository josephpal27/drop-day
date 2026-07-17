"use client";
import { useDropStore } from "@/context/DropContext";
import ProductCard from "./ProductCard";
import LoadingSkeleton from "./LoadingSkeleton";
import ErrorState from "./ErrorState";
import EmptyState from "./EmptyState";

export default function DropGrid() {
  const { products, status } = useDropStore();

  if (status === "loading" && products.length === 0) return <LoadingSkeleton />;
  if (status === "error") return <ErrorState />;
  if (status === "ready" && products.length === 0) return <EmptyState />;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}