import type { NextConfig } from "next";

/**
 * Where product covers may be loaded from. The API returns `coverImageUrl`
 * as a DigitalOcean Spaces URL (or its CDN), so those are always allowed; a
 * custom CDN domain in front of the space goes in `MORIA_IMAGE_HOSTS`,
 * comma-separated.
 */
const imageHosts = [
  "*.digitaloceanspaces.com",
  "*.cdn.digitaloceanspaces.com",
  ...(process.env.MORIA_IMAGE_HOSTS ?? "")
    .split(",")
    .map((host) => host.trim())
    .filter(Boolean),
];

/**
 * Cache Components stays off, as in the console: pages here use time-based
 * revalidation on `fetch` instead (see `src/lib/catalog.ts`).
 */
const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    // The optimizer allows an original 7 s to download, which is not
    // configurable; on a slow link every cover then fails. Setting this lets
    // the browser load covers straight from Spaces instead. Leave it unset
    // when deployed, where the optimizer sits near Spaces and caches.
    unoptimized: process.env.MORIA_IMAGES_UNOPTIMIZED === "true",
    remotePatterns: imageHosts.map((hostname) => ({
      protocol: "https",
      hostname,
    })),
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
