import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import { ProductCover } from "@/components/product-cover";
import { getProduct } from "@/lib/catalog";
import { formatGhs } from "@/lib/utils";

/** Shared by the metadata and the page, so one request serves both. */
const loadProduct = cache(async (id: string) => {
  const product = await getProduct(id);
  if (!product) notFound();
  return product;
});

export async function generateMetadata({
  params,
}: PageProps<"/products/[id]">): Promise<Metadata> {
  const product = await loadProduct((await params).id);
  const description =
    product.description ??
    `${product.name}${product.categoryName ? ` — ${product.categoryName}` : ""}, ${formatGhs(product.defaultPrice)}.`;

  return {
    title: product.name,
    description,
    alternates: { canonical: `/products/${product.id}` },
    openGraph: {
      title: product.name,
      description,
      images: product.coverImageUrl ? [product.coverImageUrl] : undefined,
    },
  };
}

export default async function ProductPage({
  params,
}: PageProps<"/products/[id]">) {
  const product = await loadProduct((await params).id);
  const categoryHref = `/?category=${product.categoryId}`;

  return (
    <article className="flex flex-col gap-6">
      <nav aria-label="Breadcrumb" className="text-sm text-on-surface-variant">
        <Link href="/" className="hover:text-regal-plum">
          Catalogue
        </Link>
        {product.categoryName && (
          <>
            <span className="mx-2 text-outline">/</span>
            <Link href={categoryHref} className="hover:text-regal-plum">
              {product.categoryName}
            </Link>
          </>
        )}
      </nav>

      <div className="grid gap-8 md:grid-cols-2 md:gap-12">
        <div className="relative aspect-square overflow-hidden rounded-2xl border border-outline-variant bg-lavender-mist">
          <ProductCover
            product={product}
            priority
            sizes="(min-width: 768px) 50vw, 100vw"
          />
        </div>

        <div className="flex flex-col gap-4">
          {product.categoryName && (
            <Link
              href={categoryHref}
              className="text-xs font-semibold tracking-[0.2em] text-plum-light uppercase hover:text-regal-plum"
            >
              {product.categoryName}
            </Link>
          )}
          <h1 className="font-display text-3xl leading-tight text-regal-plum md:text-4xl">
            {product.name}
          </h1>
          <p className="text-2xl font-semibold text-on-surface">
            {formatGhs(product.defaultPrice)}
          </p>

          {product.description && (
            <p className="leading-relaxed whitespace-pre-line text-on-surface-variant">
              {product.description}
            </p>
          )}

          <div className="mt-2 rounded-xl border border-monarch-gold/40 bg-silk-white p-5">
            <p className="font-display text-lg text-regal-plum">
              Available in our shops
            </p>
            <p className="mt-1 text-sm text-on-surface-variant">
              This catalogue is for browsing — there is no online checkout.
              Visit any Moria shop to buy. The price shown is our catalogue
              price; stock and price can vary by shop.
            </p>
          </div>

          <Link
            href="/"
            className="mt-2 self-start text-sm font-semibold text-plum-light hover:text-regal-plum"
          >
            ← Back to the catalogue
          </Link>
        </div>
      </div>
    </article>
  );
}
