"use client";

/** Shown when the API cannot be reached or refuses (e.g. rate-limited). */
export default function CatalogueError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-lg py-16 text-center">
      <h1 className="font-display text-3xl text-regal-plum">
        The catalogue is unavailable
      </h1>
      <p className="mt-3 text-on-surface-variant">
        Something went wrong loading our products. Please try again in a moment.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 rounded-lg bg-regal-plum px-5 py-3 font-semibold text-monarch-gold"
      >
        Try again
      </button>
    </div>
  );
}
