import type { ContactInfo } from "@/lib/content-schema";
import { phoneHref } from "@/lib/format";
import { Icon } from "./Icon";

// Phone-only call/reserve bar. It slides in once the hero is scrolled past (data-past-hero, set by Motion).
export function MobileCta({ contact }: { contact: ContactInfo }) {
  return (
    <div className="mobile-cta">
      <a className="btn btn-outline" href={phoneHref(contact.phone)}>
        <Icon name="phone" className="icon-sm" />
        Call
      </a>
      <a className="btn btn-blue" href={contact.reserveUrl}>
        Reserve a unit
      </a>
    </div>
  );
}
