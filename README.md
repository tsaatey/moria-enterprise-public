# Moria Enterprise — Public Catalogue

The customer-facing catalogue for Moria Enterprise: browse products by category, search, and open a product page. It is **browse-only** — no cart, checkout or customer accounts — per the [Moria API](https://github.com/tsaatey/moria-enterprise-backend) specification's _Public site_ (Phase 1.5).

It is a Next.js 16 app that reads the API's unauthenticated `/api/v1/public/*` routes (`docs/public-catalog.yaml` in the backend repo) and shares the brand theme of the [owner console](https://github.com/tsaatey/moria-enterprise-web).

## Running it locally

1. Start the API (`npm run dev` in `moria-enterprise-backend`, port 4800).
2. `cp .env.example .env.local` — the defaults point at `localhost:4800`.
3. `npm install && npm run dev`, then open http://localhost:5174.

| Command             | Description                         |
| ------------------- | ----------------------------------- |
| `npm run dev`       | Dev server on `PORT` (default 5174) |
| `npm run build`     | Production build                    |
| `npm run start`     | Serve the production build          |
| `npm run lint`      | ESLint                              |
| `npm run typecheck` | Generate route types, then `tsc`    |
| `npm run format`    | Prettier                            |

## Configuration

| Variable            | Purpose                                                                                        |
| ------------------- | ---------------------------------------------------------------------------------------------- |
| `PORT`              | Port to serve on (default `5174`)                                                              |
| `MORIA_API_URL`     | The API base, e.g. `https://api.example.com/api/v1`. Read on the server only                   |
| `SITE_URL`          | This site's public address — canonical links, sitemap, social previews. Needed at build time   |
| `MORIA_IMAGE_HOSTS` | Extra hosts covers may load from (a custom CDN domain). `*.digitaloceanspaces.com` is built in |

## How it reads the API

Every catalogue request is made **on this app's server** and cached for 5 minutes (the API's own `max-age=300`), tagged `catalog`. The browser never calls the API, which means:

- the API needs **no CORS entry** for this site;
- the API's per-IP rate limit on public routes sees this server as one client, and the cache is what keeps it under that limit. If traffic outgrows it, raise `PUBLIC_RATE_LIMIT` on the API for this server rather than calling the API from the browser.

## Pages

| Route            | What it shows                                                               |
| ---------------- | --------------------------------------------------------------------------- |
| `/`              | The catalogue: `?q=` search, `?category=` filter, `?page=` (24 per page)    |
| `/products/[id]` | One product. Hidden, deleted and unknown products are all a plain 404       |
| `/sitemap.xml`   | The catalogue, each category and each product                               |
| `/robots.txt`    | Allows everything; points at the sitemap. Search result pages are `noindex` |

Prices are the catalogue `defaultPrice`, not any one shop's price, and the site says so.
