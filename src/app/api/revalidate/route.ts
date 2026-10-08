import { createHash, timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";
import { CATALOG_TAG } from "@/lib/catalog";

/**
 * POST /api/revalidate — the API calls this after every product or category
 * write (backend `integration-services/public-site-service.js`), so a change
 * shows on the next page view instead of within five minutes.
 *
 * Authenticated with `Authorization: Bearer <REVALIDATE_SECRET>`, the same
 * value as the API's `PUBLIC_SITE_REVALIDATE_SECRET`. Without a secret set
 * the endpoint is off: an open one would let anyone empty the cache and
 * turn every visit into an API call against its rate limit.
 */
export async function POST(request: Request) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const presented = request.headers.get("authorization") ?? "";
  if (!matches(presented, `Bearer ${secret}`)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  // `expire: 0` rather than the "max" profile: the owner has just changed
  // something, so the next visitor should get it rather than the stale copy
  // that stale-while-revalidate would serve first.
  revalidateTag(CATALOG_TAG, { expire: 0 });
  return Response.json({ revalidated: true });
}

/** Constant-time comparison; hashing first evens out the lengths. */
function matches(a: string, b: string) {
  const digest = (value: string) => createHash("sha256").update(value).digest();
  return timingSafeEqual(digest(a), digest(b));
}
