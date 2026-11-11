import type { ContactInfo, SiteContent } from "@/lib/content-schema";
import { gateHoursText, phoneHref } from "@/lib/format";
import { externalLinkProps } from "@/lib/links";
import { menuHref, otherLocationLogins } from "@/lib/nav";
import { Brand } from "./Brand";
import { Icon } from "./Icon";

type Props = { contact: ContactInfo; navbar: SiteContent["navbar"]; locations: SiteContent["locations"]["items"]; year: number };

export function Footer({ contact, navbar, locations, year }: Props) {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="foot-grid">
          <div className="foot-brand">
            <a className="brand" href="#top">
              <Brand navbar={navbar} contact={contact} />
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
              {navbar.links.map((n, i) => (
                <li key={i}>
                  <a href={menuHref(n)} {...externalLinkProps(menuHref(n))}>
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="foot-col">
            <h3>Tenants</h3>
            <ul>
              <li>
                <a href={contact.payUrl} {...externalLinkProps(contact.payUrl)}>
                  Pay your bill
                </a>
              </li>
              <li>
                <a href={contact.reserveUrl} {...externalLinkProps(contact.reserveUrl)}>
                  Reserve a unit
                </a>
              </li>
              {/* One login link per sister location, from its card in Locations. */}
              {otherLocationLogins(locations).map((l) => (
                <li key={l.href}>
                  <a href={l.href} {...externalLinkProps(l.href)}>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="legal">
          <span>© {year} {navbar.name}. All rights reserved.</span>
          <span>Gate hours {gateHoursText(contact)}</span>
        </div>
      </div>
    </footer>
  );
}
