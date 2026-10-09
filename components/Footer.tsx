import { nav, site } from "@/lib/site";
import { Icon } from "./Icon";
import { Mark } from "./Mark";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="foot-grid">
          <div className="foot-brand">
            <a className="brand" href="#top">
              <Mark />
              <span className="brand-text">
                <span className="brand-name">{site.name}</span>
                <span className="brand-sub">Tulare, California</span>
              </span>
            </a>
            <p>Drive-up self storage in Tulare, CA. A Mid Valley Storage family facility.</p>
            <a className="social" href={site.instagram.url} target="_blank" rel="noopener noreferrer">
              <Icon name="instagram" className="icon-sm" />
              {site.instagram.handle}
            </a>
          </div>
          <div className="foot-col">
            <h3>Visit</h3>
            <address>
              <a href={site.mapsUrl} target="_blank" rel="noopener noreferrer">
                {site.address.street}
                <br />
                {site.address.city}, {site.address.region} {site.address.postalCode}
              </a>
              <br />
              <a href={site.phoneHref}>{site.phoneDisplay}</a>
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
              <li><a href={site.payUrl}>Pay your bill</a></li>
              <li><a href={site.reserveUrl}>Reserve a unit</a></li>
              <li><a href={site.sisterLoginUrl}>Visalia locations login</a></li>
            </ul>
          </div>
        </div>
        <div className="legal">
          <span>© {year} {site.name}. All rights reserved.</span>
          <span>Gate hours {site.gateHours}</span>
        </div>
      </div>
    </footer>
  );
}
