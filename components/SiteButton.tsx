import type { ContactInfo, SiteButton as Button } from "@/lib/content-schema";
import { phoneHref } from "@/lib/format";
import { Icon } from "./Icon";

/** Where a button goes: the shared Reserve / Pay links, phone and map from the contact details, or its own address. */
export function buttonHref(b: Button, contact: ContactInfo): string {
  switch (b.to) {
    case "reserve":
      return contact.reserveUrl;
    case "pay":
      return contact.payUrl;
    case "call":
      return phoneHref(contact.phone);
    case "directions":
      return contact.mapsUrl;
    case "sizes":
      return "#units";
    case "contact":
      return "#visit";
    case "link":
      return b.url || contact.reserveUrl;
  }
}

type Props = {
  button: Button;
  contact: ContactInfo;
  className: string;
  /** Arrow after the words (not on call or directions buttons, which get their own icon in front). */
  arrow?: boolean;
  /** Call buttons: show the phone number after the words, as in "Call (559) 688-4787". */
  withNumber?: boolean;
};

/** A button whose words and destination are edited in the admin panel. */
export function SiteButton({ button: b, contact, className, arrow = false, withNumber = false }: Props) {
  const newTab = b.to === "directions" ? { target: "_blank", rel: "noopener noreferrer" } : {};
  return (
    <a className={className} href={buttonHref(b, contact)} {...newTab}>
      {b.to === "call" && <Icon name="phone" className="icon-sm" />}
      {b.to === "directions" && <Icon name="map" className="icon-sm" />}
      {b.label}
      {withNumber && b.to === "call" && ` ${contact.phone}`}
      {arrow && b.to !== "call" && b.to !== "directions" && <Icon name="arrow" className="icon-arrow" />}
    </a>
  );
}
