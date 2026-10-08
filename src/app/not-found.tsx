import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg py-16 text-center">
      <p className="text-xs font-semibold tracking-[0.25em] text-plum-light uppercase">
        Not found
      </p>
      <h1 className="mt-3 font-display text-3xl text-regal-plum">
        We couldn’t find that
      </h1>
      <p className="mt-3 text-on-surface-variant">
        The product may no longer be in our catalogue.
      </p>
      <Link
        href="/"
        className="mt-6 inline-block rounded-lg bg-regal-plum px-5 py-3 font-semibold text-monarch-gold"
      >
        Browse the catalogue
      </Link>
    </div>
  );
}
