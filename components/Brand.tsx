import type { ContactInfo, SiteContent } from "@/lib/content-schema";
import { Mark } from "./Mark";

/** Logo, business name and the small line under it, as set on the "Menu bar & logo" screen. */
export function Brand({ navbar, contact }: { navbar: SiteContent["navbar"]; contact: ContactInfo }) {
  return (
    <>
      {navbar.logo.src ? (
        // An uploaded logo of any shape: shown at the mark's height. Decorative, the name is right next to it.
        // eslint-disable-next-line @next/next/no-img-element
        <img className="brand-logo" src={navbar.logo.src} alt="" />
      ) : (
        <Mark />
      )}
      <span className="brand-text">
        <span className="brand-name">{navbar.name}</span>
        <span className="brand-sub">{navbar.tagline || `${contact.city}, California`}</span>
      </span>
    </>
  );
}
