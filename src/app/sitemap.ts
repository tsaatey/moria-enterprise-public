import type { MetadataRoute } from "next";
import { connection } from "next/server";
import { getCategories, getProducts, MAX_PAGE_SIZE } from "@/lib/catalog";
import { siteUrl } from "@/lib/utils";

/** The catalogue, every category and every product, read page by page. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Rendered on request rather than at build, so a build never needs the API
  // to be reachable. Unlike `dynamic = "force-dynamic"`, this leaves the
  // catalogue reads below cached.
  await connection();
  const base = siteUrl();
  const categories = await getCategories();

  const productIds: string[] = [];
  for (let page = 1; ; page++) {
    const result = await getProducts({ page, limit: MAX_PAGE_SIZE });
    productIds.push(...result.data.map((p) => p.id));
    if (page >= result.pagination.totalPages) break;
  }

  return [
    { url: `${base}/` },
    ...categories.map((c) => ({ url: `${base}/?category=${c.id}` })),
    ...productIds.map((id) => ({ url: `${base}/products/${id}` })),
  ];
}
