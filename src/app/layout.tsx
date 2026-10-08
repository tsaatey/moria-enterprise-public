import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Hanken_Grotesk, Playfair_Display } from "next/font/google";
import { siteUrl } from "@/lib/utils";
import "./globals.css";

const hanken = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: "Moria Enterprise — Catalogue",
    template: "%s · Moria Enterprise",
  },
  description:
    "Browse the Moria Enterprise catalogue — bundles, wigs, lace systems and more.",
  openGraph: { siteName: "Moria Enterprise", type: "website" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${hanken.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <header className="luxury-gradient text-silk-white">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 md:px-8">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/moria-logo.png"
                alt="Moria Enterprise"
                width={584}
                height={300}
                priority
                className="h-12 w-auto md:h-14"
              />
            </Link>
            <nav>
              <Link
                href="/"
                className="text-sm font-semibold tracking-wide text-monarch-gold uppercase hover:text-silk-white"
              >
                Catalogue
              </Link>
            </nav>
          </div>
        </header>

        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 md:px-8 md:py-12">
          {children}
        </main>

        <footer className="border-t border-outline-variant bg-lavender-mist">
          <div className="mx-auto max-w-7xl px-4 py-8 text-sm text-on-surface-variant md:px-8">
            <p className="font-display text-base text-regal-plum">
              Moria Enterprise
            </p>
            <p className="mt-2">
              Prices shown are catalogue prices. Availability and price may vary
              by shop — please ask in store.
            </p>
            <p className="mt-4 text-xs text-outline">
              © {new Date().getFullYear()} Moria Enterprise
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
