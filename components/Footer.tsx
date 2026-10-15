import type { ContactInfo } from "@/lib/content-schema";
import { brand } from "@/lib/brand";
import { gateHoursText, phoneHref } from "@/lib/format";
import { nav } from "@/lib/nav";
import { Icon } from "./Icon";
import { Mark } from "./Mark";

export function Footer({ contact, year }: { contact: ContactInfo; year: number }) {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="foot-grid">
          <div className="foot-brand">
            <a className="brand" href="#top">
              <Mark />
              <span className="brand-text">
                <span className="brand-name">{brand.name}</span>
                <span className="brand-sub">{contact.city}, California</span>
              </span>
            </a>
            <p>Drive-up self storage in {contact.city}, {contact.region}. A Mid Valley Storage family facility.</p>
            {contact.instagramUrl && (
              <a className="social" href={contact.instagramUrl} target="_blank" rel="noopener noreferrer">
                <Icon name="instagram" className="icon-sm" />
                {contact.instagramHandle || "Instagram"}
              </a>
            )}
          </div>
          <div className="foot-col">
            <h3>Visit</h3>
            <address>
              <a href={contact.mapsUrl} target="_blank" rel="noopener noreferrer">
                {contact.street}
                <br />
                {contact.city}, {contact.region} {contact.postalCode}
              </a>
              <br />
              <a href={phoneHref(contact.phone)}>{contact.phone}</a>
            </address>
          </div>
          <div className="foot-col">
            <h3>Explore</h3>
            <ul>
              {nav.map((n) => (
                <li key={n.href}>
                  <a href={n.href}>{n.label}</a>
                </li>
              ))}
            </ul>
          </div>
          <div className="foot-col">
            <h3>Tenants</h3>
            <ul>
              <li><a href={contact.payUrl}>Pay your bill</a></li>
              <li><a href={contact.reserveUrl}>Reserve a unit</a></li>
              {contact.sisterLoginUrl && <li><a href={contact.sisterLoginUrl}>Visalia locations login</a></li>}
            </ul>
          </div>
        </div>
        <div className="legal">
          <span>© {year} {brand.name}. All rights reserved.</span>
          <span>Gate hours {gateHoursText(contact)}</span>
        </div>
      </div>
    </footer>
  );
}
