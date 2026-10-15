import type { ContactInfo } from "@/lib/content-schema";
import { brand } from "@/lib/brand";
import { gateHoursText, phoneHref } from "@/lib/format";
import { nav } from "@/lib/nav";
import { Icon } from "./Icon";
import { Mark } from "./Mark";
import { MobileMenu } from "./MobileMenu";

export function Header({ contact }: { contact: ContactInfo }) {
  return (
    <>
      <div className="utility">
        <div className="wrap">
          <div className="utility-group">
            <span className="utility-item utility-hide-sm">
              <Icon name="pin" className="icon-xs" />
              {contact.street}, {contact.city}, {contact.region}
            </span>
            <span className="utility-item utility-hide-sm">
              <Icon name="clock" className="icon-xs" />
              Gate open {gateHoursText(contact)}
            </span>
          </div>
          <a className="utility-item" href={phoneHref(contact.phone)}>
            <Icon name="phone" className="icon-xs" />
            Call {contact.phone}
          </a>
        </div>
      </div>
      <header className="site-header">
        <div className="wrap bar">
          <a className="brand" href="#top" aria-label={`${brand.name}, back to top`}>
            <Mark />
            <span className="brand-text">
              <span className="brand-name">{brand.name}</span>
              <span className="brand-sub">
                {contact.city}, California
              </span>
            </span>
          </a>
          <nav className="nav" aria-label="Main">
            {nav.map((item) => (
              <a key={item.href} href={item.href}>
                {item.label}
              </a>
            ))}
          </nav>
          <div className="header-actions">
            <a className="btn btn-outline btn-sm" href={contact.payUrl}>
              Pay bill
            </a>
            <a className="btn btn-blue btn-sm" href={contact.reserveUrl}>
              Reserve a unit
            </a>
            <MobileMenu
              payUrl={contact.payUrl}
              sisterLoginUrl={contact.sisterLoginUrl}
              phone={contact.phone}
              phoneHref={phoneHref(contact.phone)}
            />
          </div>
        </div>
      </header>
    </>
  );
}
