import Image from "next/image";
import type { Product } from "@/lib/catalog";

/**
 * A product's cover photo, or — since covers are optional — a plum panel
 * with the product's initial, so a grid with missing photos still lines up.
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
  if (product.coverImageUrl) {
    return (
      <Image
        src={product.coverImageUrl}
        alt={product.name}
        fill
        sizes={sizes}
        priority={priority}
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
