import Link from "next/link";
import type { Product } from "@/lib/catalog";
import { formatGhs, wholesaleOffer } from "@/lib/utils";
import { ProductCover } from "./product-cover";

export function ProductCard({
  product,
  priority,
}: {
  product: Product;
  priority?: boolean;
}) {
  return (
    <Link
      href={`/products/${product.id}`}
      className="group flex w-full flex-col overflow-hidden rounded-xl border border-outline-variant bg-white transition hover:border-monarch-gold hover:shadow-lg"
    >
      <div className="relative aspect-square overflow-hidden bg-lavender-mist">
        <div className="relative h-full w-full transition duration-300 group-hover:scale-105">
          <ProductCover
            product={product}
            priority={priority}
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        {product.categoryName && (
          <p className="text-xs font-semibold tracking-wider text-plum-light uppercase">
            {product.categoryName}
          </p>
        )}
        <h3 className="font-display text-lg leading-snug text-regal-plum">
          {product.name}
        </h3>
        <p className="mt-auto pt-2 font-semibold text-on-surface">
          {formatGhs(product.defaultPrice)}
        </p>
        {wholesaleOffer(product) && (
          <p className="text-xs text-plum-light">
            Wholesale: {wholesaleOffer(product)}
          </p>
        )}
      </div>
    </Link>
  );
}
