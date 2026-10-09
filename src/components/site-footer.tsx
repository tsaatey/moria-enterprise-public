import Image from "next/image";
import Link from "next/link";
import {
  siInstagram,
  siSnapchat,
  siTiktok,
  siWhatsapp,
  type SimpleIcon,
} from "simple-icons";
import { getShops, type Shop } from "@/lib/catalog";
import { directContacts, socialLinks, type ContactLink } from "@/lib/contact";

const ICONS: Partial<Record<ContactLink["key"], SimpleIcon>> = {
  whatsapp: siWhatsapp,
  instagram: siInstagram,
  tiktok: siTiktok,
  snapchat: siSnapchat,
};

/**
 * The shops come from the API; a footer that fails to load them should not
 * take the page down with it, so a failure is an empty list.
 */
async function loadShops(): Promise<Shop[]> {
  try {
    return await getShops();
  } catch {
    return [];
  }
}

export async function SiteFooter() {
  const [shops, socials, direct] = await Promise.all([
    loadShops(),
    socialLinks(),
    directContacts(),
  ]);
  const hasContact = socials.length > 0 || direct.length > 0;

  return (
    <footer className="luxury-gradient mt-8 text-silk-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-3 md:px-8">
        <div className="flex flex-col gap-4">
          <Link href="/" className="self-start">
            <Image
              src="/moria-logo.png"
              alt="Moria Enterprise"
              width={584}
              height={300}
              className="h-14 w-auto"
            />
          </Link>
          <p className="max-w-xs text-sm text-silk-white/75">
            Wigs, bundles, lace systems and hair care. Browse online, then buy
            in any of our shops.
          </p>
          <p className="text-xs text-silk-white/60">
            Prices shown are catalogue prices. Availability and price may vary
            by shop — please ask in store.
          </p>
        </div>

        {shops.length > 0 && (
          <div>
            <FooterHeading>Visit our shops</FooterHeading>
            <ul className="mt-4 flex flex-col gap-3">
              {shops.map((shop) => (
                <li key={shop.name}>
                  <p className="font-semibold">{shop.name}</p>
                  {shop.location && (
                    <p className="text-sm text-silk-white/70">
                      {shop.location}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {hasContact && (
          <div>
            <FooterHeading>Get in touch</FooterHeading>

            {socials.length > 0 && (
              <ul className="mt-4 flex flex-wrap gap-3">
                {socials.map((link) => (
                  <li key={link.key}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${link.label}: ${link.display}`}
                      title={`${link.label}: ${link.display}`}
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 transition hover:border-monarch-gold hover:bg-monarch-gold hover:text-regal-plum"
                    >
                      <BrandIcon icon={ICONS[link.key]!} />
                    </a>
                  </li>
                ))}
              </ul>
            )}

            <ul className="mt-5 flex flex-col gap-2 text-sm">
              {[...socials, ...direct].map((link) => (
                <li key={link.key} className="flex gap-2">
                  <span className="w-20 shrink-0 text-silk-white/60">
                    {link.label}
                  </span>
                  <a
                    href={link.href}
                    {...(link.href.startsWith("http")
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className="break-all text-silk-white hover:text-monarch-gold"
                  >
                    {link.display}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="border-t border-white/10">
        <p className="mx-auto max-w-7xl px-4 py-5 text-xs text-silk-white/50 md:px-8">
          © {new Date().getFullYear()} Moria Enterprise
        </p>
      </div>
    </footer>
  );
}

function FooterHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xs font-semibold tracking-[0.25em] text-monarch-gold uppercase">
      {children}
    </h2>
  );
}

/** A brand mark from simple-icons, in the current text colour. */
function BrandIcon({ icon }: { icon: SimpleIcon }) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      aria-hidden
      className="h-5 w-5 fill-current"
    >
      <path d={icon.path} />
    </svg>
  );
}
