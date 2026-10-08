<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

<!-- BEGIN:public-site-rules -->

## Public catalogue

Browse-only: no cart, checkout, accounts, or calls to the API's staff routes (backend `specification.md`, "What the public site does _not_ do"). Only `/api/v1/public/*` is used, and only through `src/lib/catalog.ts`.

Keep catalogue reads on the server. `catalog.ts` is `server-only`, and its `fetch` calls are cached for 300 s with the `catalog` tag. The API rate-limits public routes per IP, so moving these calls into the browser — or using `dynamic = "force-dynamic"`, which turns that cache off — would send every visitor's request straight to the API. To render per request while keeping the cache, use `await connection()` (see `src/app/sitemap.ts`).

Every catalogue read must carry the `catalog` tag (it does, through `get()` in `catalog.ts`): `/api/revalidate` clears that tag when the API reports a product or category change, and an untagged read would stay stale for five minutes.

Show only what the public product shape carries. Prices are the catalogue `defaultPrice`, not a shop's price; money arrives as 2-dp strings and is formatted for display only. Product covers are optional, so every image spot needs the `ProductCover` fallback.

The design follows the console's brand theme (backend `prototypes/shared/theme.js`); there is no public-site prototype.

<!-- END:public-site-rules -->

<!-- BEGIN:branch-workflow-rules -->

## Branch workflow

Never commit directly on `development` or `main`. Branch from `main`, PR onto `development`, and release with a PR from `development` onto `main`. See `.claude/rules/branch-workflow.md`.

<!-- END:branch-workflow-rules -->
