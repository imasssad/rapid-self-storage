import type { ContactInfo, SiteContent } from "@/lib/content-schema";
import { SiteButton } from "./SiteButton";

// Phone-only call/reserve bar. It slides in once the hero is scrolled past (data-past-hero, set by Motion).
export function MobileCta({ bar, contact }: { bar: SiteContent["home"]["mobileBar"]; contact: ContactInfo }) {
  return (
    <div className="mobile-cta">
      <SiteButton button={bar.secondButton} contact={contact} className="btn btn-outline" />
      <SiteButton button={bar.button} contact={contact} className="btn btn-blue" />
    </div>
  );
}
