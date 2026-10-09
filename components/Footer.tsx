import { nav, site } from "@/lib/site";
import { Mark } from "./Mark";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="foot-grid">
          <div>
            <a className="brand" href="#top">
              <Mark />
              {site.name}
            </a>
            <p>Drive-up self storage in Tulare, CA. A Mid Valley Storage family facility.</p>
          </div>
          <div className="foot-col">
            <h3>Visit</h3>
            <address>
              {site.address.street}
              <br />
              {site.address.city}, {site.address.region} {site.address.postalCode}
              <br />
              {site.phoneDisplay}
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
              <li><a href={site.instagram.url}>Instagram</a></li>
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
