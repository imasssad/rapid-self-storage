import { nav, site } from "@/lib/site";
import { Mark } from "./Mark";
import { MobileMenu } from "./MobileMenu";

export function Header() {
  return (
    <>
      <div className="utility">
        <div className="wrap">
          <div className="utility-group">
            <span className="utility-hide-sm">
              {site.address.street}, {site.address.city}, {site.address.region}
            </span>
            <span className="utility-hide-sm">Gate open {site.gateHours}</span>
          </div>
          <div className="utility-group">
            <a href={site.phoneHref}>Call {site.phoneDisplay}</a>
          </div>
        </div>
      </div>
      <header className="site-header">
        <div className="wrap bar">
          <a className="brand" href="#top" aria-label="Rapid Self Storage, back to top">
            <Mark />
            {site.name}
          </a>
          <nav className="nav" aria-label="Main">
            {nav.map((item) => (
              <a key={item.href} href={item.href}>
                {item.label}
              </a>
            ))}
          </nav>
          <div className="header-actions">
            <a className="btn btn-outline" href={site.payUrl}>
              Pay bill
            </a>
            <a className="btn btn-blue" href={site.reserveUrl}>
              Reserve a unit
            </a>
            <MobileMenu />
          </div>
        </div>
      </header>
    </>
  );
}
