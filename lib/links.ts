// Links to other websites (the Storedge rental center, Google Maps, Instagram) open in a new tab, so the
// website stays open behind them.
import { brand } from "./brand";

const ownHost = new URL(brand.url).hostname.replace(/^www\./, "");

export function externalLinkProps(href: string): { target?: "_blank"; rel?: string } {
  if (!/^https?:\/\//i.test(href)) return {};
  try {
    if (new URL(href).hostname.replace(/^www\./, "") === ownHost) return {};
  } catch {
    return {};
  }
  return { target: "_blank", rel: "noopener noreferrer" };
}
