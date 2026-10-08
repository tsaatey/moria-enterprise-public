"use client";

import Image from "next/image";
import { useState } from "react";
import type { Product } from "@/lib/catalog";

/**
 * A product's cover photo, or — since covers are optional — a plum panel
 * with the product's initial, so a grid with missing photos still lines up.
 *
 * The same panel stands in when a cover fails to load. That happens when the
 * image optimizer cannot fetch the original in time — it gives up after a
 * fixed 7 s and answers 504 — and a broken-image icon is worse than the
 * placeholder a product with no cover already gets.
 *
 * A client component only for that `onError`.
 */
export function ProductCover({
  product,
  sizes,
  priority = false,
}: {
  product: Product;
  sizes: string;
  priority?: boolean;
}) {
  const [failed, setFailed] = useState(false);

  if (product.coverImageUrl && !failed) {
    return (
      <Image
        src={product.coverImageUrl}
        alt={product.name}
        fill
        sizes={sizes}
        priority={priority}
        onError={() => setFailed(true)}
        className="object-cover"
      />
    );
  }

  return (
    <div
      aria-hidden
      className="luxury-gradient flex h-full w-full items-center justify-center"
    >
      <span className="font-display text-6xl text-monarch-gold/70">
        {product.name.charAt(0).toUpperCase()}
      </span>
    </div>
  );
}
