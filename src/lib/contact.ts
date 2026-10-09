import "server-only";

/**
 * How customers reach Moria, from the site's own settings — none of this is
 * in the API. Each item appears in the footer only when its setting is
 * filled in, so the site never shows a placeholder number or a dead link.
 */

export type ContactLink = {
  key: "whatsapp" | "instagram" | "tiktok" | "snapchat" | "phone" | "email";
  label: string;
  /** What is shown: the number, address or @handle. */
  display: string;
  href: string;
};

/** Trim, and drop a leading "@" from a social handle. */
function setting(name: string, { handle = false } = {}) {
  const value = process.env[name]?.trim();
  if (!value) return null;
  return handle ? value.replace(/^@/, "") : value;
}

/**
 * A phone number in international form without the "+", as wa.me and tel:
 * want: "+233 24 000 0001" and "024 000 0001" both become "233240000001".
 * A leading 0 is taken as a Ghanaian number, which is where the shops are.
 */
function international(phone: string) {
  const digits = phone.replace(/[^\d]/g, "");
  return digits.startsWith("0") ? `233${digits.slice(1)}` : digits;
}

/** The social profiles that are set, in footer order. */
export function socialLinks(): ContactLink[] {
  const links: ContactLink[] = [];

  const whatsapp = setting("MORIA_WHATSAPP");
  if (whatsapp) {
    links.push({
      key: "whatsapp",
      label: "WhatsApp",
      display: whatsapp,
      href: `https://wa.me/${international(whatsapp)}`,
    });
  }

  const instagram = setting("MORIA_INSTAGRAM", { handle: true });
  if (instagram) {
    links.push({
      key: "instagram",
      label: "Instagram",
      display: `@${instagram}`,
      href: `https://www.instagram.com/${instagram}`,
    });
  }

  const tiktok = setting("MORIA_TIKTOK", { handle: true });
  if (tiktok) {
    links.push({
      key: "tiktok",
      label: "TikTok",
      display: `@${tiktok}`,
      href: `https://www.tiktok.com/@${tiktok}`,
    });
  }

  const snapchat = setting("MORIA_SNAPCHAT", { handle: true });
  if (snapchat) {
    links.push({
      key: "snapchat",
      label: "Snapchat",
      display: snapchat,
      href: `https://www.snapchat.com/add/${snapchat}`,
    });
  }

  return links;
}

/** Phone and email, when set. */
export function directContacts(): ContactLink[] {
  const links: ContactLink[] = [];

  const phone = setting("MORIA_CONTACT_PHONE");
  if (phone) {
    links.push({
      key: "phone",
      label: "Call",
      display: phone,
      href: `tel:+${international(phone)}`,
    });
  }

  const email = setting("MORIA_CONTACT_EMAIL");
  if (email) {
    links.push({
      key: "email",
      label: "Email",
      display: email,
      href: `mailto:${email}`,
    });
  }

  return links;
}
