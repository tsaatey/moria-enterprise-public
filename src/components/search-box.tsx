"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";

/** How long typing must pause before the catalogue is filtered. */
const DEBOUNCE_MS = 300;

/**
 * The catalogue search, filtering as you type.
 *
 * It keeps the search in the URL (`?q=`) rather than in component state, so
 * results stay server-rendered, shareable and cached exactly as before:
 * typing just replaces the URL after a short pause. Emptying the box drops
 * `q`, which restores the full catalogue. The current category is kept, and
 * paging resets to the first page.
 *
 * It is still a real GET form, so pressing Enter — or using the site with
 * JavaScript off — searches the same way.
 */
export function SearchBox({
  query,
  category,
}: {
  query?: string;
  category?: string;
}) {
  const router = useRouter();
  const [value, setValue] = useState(query ?? "");
  const [pending, startTransition] = useTransition();
  // The last query this box sent, so an incoming URL change it caused does
  // not overwrite what the user is still typing.
  const sent = useRef(query ?? "");

  // Follow the URL when something else changes it — "Clear search", a
  // category chip, back/forward.
  useEffect(() => {
    const incoming = query ?? "";
    if (incoming !== sent.current) {
      sent.current = incoming;
      setValue(incoming);
    }
  }, [query]);

  useEffect(() => {
    const term = value.trim();
    if (term === sent.current) return;

    const timer = setTimeout(() => {
      sent.current = term;
      const params = new URLSearchParams();
      if (term) params.set("q", term);
      if (category) params.set("category", category);
      const search = params.toString();
      startTransition(() => {
        router.replace(search ? `/?${search}` : "/", { scroll: false });
      });
    }, DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [value, category, router]);

  return (
    <form action="/" className="mt-6 flex max-w-xl gap-2" role="search">
      {category && <input type="hidden" name="category" value={category} />}
      <label htmlFor="q" className="sr-only">
        Search the catalogue
      </label>
      <div className="relative min-w-0 flex-1">
        <input
          id="q"
          name="q"
          type="search"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          maxLength={200}
          autoComplete="off"
          placeholder="Search products…"
          className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-3 pr-10 text-silk-white placeholder:text-silk-white/60 focus:border-monarch-gold focus:outline-none"
        />
        {pending && (
          <span
            aria-hidden
            className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 animate-spin rounded-full border-2 border-monarch-gold border-t-transparent"
          />
        )}
      </div>
      <button
        type="submit"
        className="rounded-lg bg-monarch-gold px-5 py-3 font-semibold text-regal-plum transition hover:bg-[#f2d472]"
      >
        Search
      </button>
      <p aria-live="polite" className="sr-only">
        {pending ? "Searching…" : ""}
      </p>
    </form>
  );
}
