/** Join class names, skipping falsy ones. */
export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const ghs = new Intl.NumberFormat("en-GH", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/**
 * Format a price from the API for display. The API sends amounts as 2-dp
 * strings; the conversion here is for display only.
 */
export function formatGhs(amount: string) {
  return `GHS ${ghs.format(Number(amount))}`;
}

/** The site's own address, without a trailing slash. */
export function siteUrl() {
  return (process.env.SITE_URL ?? "http://localhost:5174").replace(/\/$/, "");
}
