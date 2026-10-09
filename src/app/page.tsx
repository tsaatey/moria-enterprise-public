import type { Metadata } from "next";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { SearchBox } from "@/components/search-box";
import { getCategories, getProducts, isId } from "@/lib/catalog";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 24;

type Filters = { q?: string; category?: string; page: number };

/** The catalogue's URL state: `?q=&category=&page=`. Anything else is ignored. */
function readFilters(params: Record<string, string | string[] | undefined>) {
  const one = (key: string) => {
    const value = params[key];
    return (Array.isArray(value) ? value[0] : value)?.trim() || undefined;
  };
  const page = Number(one("page"));
  return {
    q: one("q"),
    category: isId(one("category")) ? one("category") : undefined,
    page: Number.isInteger(page) && page > 1 ? page : 1,
  } satisfies Filters;
}

/** A catalogue link with `changes` applied; a filter change goes to page 1. */
function hrefFor(current: Filters, changes: Partial<Filters>) {
  const next = { ...current, page: 1, ...changes };
  const query = new URLSearchParams();
  if (next.q) query.set("q", next.q);
  if (next.category) query.set("category", next.category);
  if (next.page > 1) query.set("page", String(next.page));
  const search = query.toString();
  return search ? `/?${search}` : "/";
}

export async function generateMetadata({
  searchParams,
}: PageProps<"/">): Promise<Metadata> {
  const filters = readFilters(await searchParams);
  const categories = await getCategories();
  const category = categories.find((c) => c.id === filters.category);

  return {
    // The layout's title template reaches child segments only, not this page,
    // so the suffix is written out here. With no category, the key is left out
    // (an explicit `undefined` would blank the layout's default title).
    ...(category && { title: `${category.name} · Moria Enterprise` }),
    alternates: { canonical: hrefFor({ ...filters, q: undefined }, {}) },
    // Search results are endless and thin; keep them out of search engines.
    robots: filters.q ? { index: false } : undefined,
  };
}

export default async function CataloguePage({ searchParams }: PageProps<"/">) {
  const filters = readFilters(await searchParams);
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts({
      search: filters.q,
      categoryId: filters.category,
      page: filters.page,
      limit: PAGE_SIZE,
    }),
  ]);
  const category = categories.find((c) => c.id === filters.category);
  const { page, totalPages, totalItems } = products.pagination;

  return (
    <div className="flex flex-col gap-8">
      <section className="luxury-gradient overflow-hidden rounded-2xl px-6 py-10 text-silk-white md:px-12 md:py-14">
        <p className="text-xs font-semibold tracking-[0.25em] text-monarch-gold uppercase">
          The Moria Catalogue
        </p>
        <h1 className="mt-3 max-w-2xl font-display text-3xl leading-tight md:text-5xl">
          {category ? category.name : "Hair, crafted for royalty"}
        </h1>
        <p className="mt-3 max-w-xl text-silk-white/80">
          Browse everything we carry. Visit any of our shops to buy, or to check
          what is in stock today.
        </p>

        <SearchBox query={filters.q} category={filters.category} />
      </section>

      {categories.length > 0 && (
        <nav aria-label="Categories" className="-mx-4 overflow-x-auto px-4">
          <ul className="flex gap-2 pb-1">
            <li>
              <CategoryChip
                href={hrefFor(filters, { category: undefined })}
                active={!filters.category}
              >
                All
              </CategoryChip>
            </li>
            {categories.map((c) => (
              <li key={c.id}>
                <CategoryChip
                  href={hrefFor(filters, { category: c.id })}
                  active={c.id === filters.category}
                >
                  {c.name}
                </CategoryChip>
              </li>
            ))}
          </ul>
        </nav>
      )}

      <section aria-labelledby="results">
        <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
          <h2 id="results" className="font-display text-2xl text-regal-plum">
            {filters.q
              ? `Results for “${filters.q}”`
              : category
                ? `Everything in ${category.name}`
                : "All products"}
          </h2>
          <p className="text-sm text-on-surface-variant">
            {totalItems} {totalItems === 1 ? "product" : "products"}
            {filters.q && (
              <>
                {" · "}
                <Link
                  href={hrefFor(filters, { q: undefined })}
                  className="font-semibold text-plum-light underline-offset-2 hover:underline"
                >
                  Clear search
                </Link>
              </>
            )}
          </p>
        </div>

        {products.data.length === 0 ? (
          <div className="rounded-xl border border-dashed border-outline-variant bg-white px-6 py-16 text-center">
            <p className="font-display text-xl text-regal-plum">
              Nothing matches that
            </p>
            <p className="mt-2 text-on-surface-variant">
              Try a different search, or{" "}
              <Link href="/" className="font-semibold text-plum-light">
                browse the whole catalogue
              </Link>
              .
            </p>
          </div>
        ) : (
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-6 lg:grid-cols-4">
            {products.data.map((product, index) => (
              <li key={product.id} className="flex">
                <ProductCard product={product} priority={index < 4} />
              </li>
            ))}
          </ul>
        )}

        {totalPages > 1 && (
          <nav
            aria-label="Pages"
            className="mt-10 flex items-center justify-center gap-4"
          >
            <PageLink
              href={hrefFor(filters, { page: page - 1 })}
              disabled={page <= 1}
            >
              ← Previous
            </PageLink>
            <span className="text-sm text-on-surface-variant">
              Page {page} of {totalPages}
            </span>
            <PageLink
              href={hrefFor(filters, { page: page + 1 })}
              disabled={page >= totalPages}
            >
              Next →
            </PageLink>
          </nav>
        )}
      </section>
    </div>
  );
}

function CategoryChip({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "block rounded-full border px-4 py-2 text-sm font-semibold whitespace-nowrap transition",
        active
          ? "border-regal-plum bg-regal-plum text-monarch-gold"
          : "border-outline-variant bg-white text-on-surface-variant hover:border-plum-light hover:text-regal-plum",
      )}
    >
      {children}
    </Link>
  );
}

function PageLink({
  href,
  disabled,
  children,
}: {
  href: string;
  disabled: boolean;
  children: React.ReactNode;
}) {
  const className =
    "rounded-lg border px-4 py-2 text-sm font-semibold transition";
  if (disabled) {
    return (
      <span
        aria-disabled
        className={cn(className, "border-outline-variant text-outline")}
      >
        {children}
      </span>
    );
  }
  return (
    <Link
      href={href}
      className={cn(
        className,
        "border-regal-plum text-regal-plum hover:bg-lavender-mist",
      )}
    >
      {children}
    </Link>
  );
}
