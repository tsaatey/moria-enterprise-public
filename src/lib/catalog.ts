import "server-only";

/**
 * The public catalogue, read from the Moria API's `/api/v1/public/*` routes
 * (backend `docs/public-catalog.yaml`).
 *
 * Every call happens on this app's server, never in the browser, for two
 * reasons. Responses are cached here for `REVALIDATE_SECONDS`, so a page view
 * rarely reaches the API at all — which matters because the API rate-limits
 * the public routes per IP, and to the API every visitor of this site is the
 * same IP. And the API needs no CORS entry for a site it never hears from.
 */

/** The API's own `Cache-Control: public, max-age=300` on these routes. */
const REVALIDATE_SECONDS = 300;

/** Tag on every cached response, for a future on-demand `revalidateTag`. */
export const CATALOG_TAG = "catalog";

/** `limit` is 100 at most (backend `docs/_components.yaml`). */
export const MAX_PAGE_SIZE = 100;

export type Category = { id: string; name: string };

/** The public product shape — § Public routes. No barcode, cost or stock. */
export type Product = {
  id: string;
  name: string;
  description: string | null;
  categoryId: string;
  categoryName: string | null;
  /** The catalogue price, a 2-dp string. Not any one shop's price. */
  defaultPrice: string;
  /**
   * The catalogue's wholesale offer: `wholesalePrice` each when buying at
   * least `wholesaleMinQuantity` of this item. Both null when there is none.
   */
  wholesalePrice: string | null;
  wholesaleMinQuantity: number | null;
  coverImageUrl: string | null;
};

export type Pagination = {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
};

export type ProductPage = { data: Product[]; pagination: Pagination };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Whether `value` could be an id at all. The API answers a malformed id with
 * a 400, which on a shared or hand-typed link should read as "not found"
 * rather than an error — so such ids are never sent.
 */
export function isId(value: string | undefined): value is string {
  return !!value && UUID.test(value);
}

function apiUrl(path: string, query?: Record<string, string | undefined>) {
  const base = process.env.MORIA_API_URL;
  if (!base) throw new Error("MORIA_API_URL is not set");
  const url = new URL(`${base.replace(/\/$/, "")}/public${path}`);
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value) url.searchParams.set(key, value);
  }
  return url;
}

async function get(url: URL) {
  return fetch(url, {
    next: { revalidate: REVALIDATE_SECONDS, tags: [CATALOG_TAG] },
  });
}

async function failed(res: Response): Promise<never> {
  const body = await res.text().catch(() => "");
  throw new Error(`Catalogue request failed (${res.status}): ${body}`);
}

export type Shop = { name: string; location: string | null };

/** Open shops, by name — where to buy. */
export async function getShops(): Promise<Shop[]> {
  const res = await get(apiUrl("/shops"));
  if (!res.ok) return failed(res);
  return res.json();
}

/** Active categories, by name. */
export async function getCategories(): Promise<Category[]> {
  const res = await get(apiUrl("/categories"));
  if (!res.ok) return failed(res);
  return res.json();
}

/** One page of active products, by name. */
export async function getProducts(options: {
  search?: string;
  categoryId?: string;
  page?: number;
  limit?: number;
}): Promise<ProductPage> {
  const res = await get(
    apiUrl("/products", {
      search: options.search?.slice(0, 200),
      categoryId: isId(options.categoryId) ? options.categoryId : undefined,
      page: options.page ? String(options.page) : undefined,
      limit: options.limit ? String(options.limit) : undefined,
    }),
  );
  if (!res.ok) return failed(res);
  return res.json();
}

/**
 * One active product, or `null` when there is none to show. The API does not
 * distinguish hidden from missing, and neither does this.
 */
export async function getProduct(id: string): Promise<Product | null> {
  if (!isId(id)) return null;
  const res = await get(apiUrl(`/products/${id}`));
  if (res.status === 404) return null;
  if (!res.ok) return failed(res);
  return res.json();
}
