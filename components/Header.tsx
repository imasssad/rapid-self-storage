import { nav, site } from "@/lib/site";
import { Icon } from "./Icon";
import { Mark } from "./Mark";
import { MobileMenu } from "./MobileMenu";

export function Header() {
  return (
    <>
      <div className="utility">
        <div className="wrap">
          <div className="utility-group">
            <span className="utility-item utility-hide-sm">
              <Icon name="pin" className="icon-xs" />
              {site.address.street}, {site.address.city}, {site.address.region}
            </span>
            <span className="utility-item utility-hide-sm">
              <Icon name="clock" className="icon-xs" />
              Gate open {site.gateHours}
            </span>
          </div>
          <a className="utility-item" href={site.phoneHref}>
            <Icon name="phone" className="icon-xs" />
            Call {site.phoneDisplay}
          </a>
        </div>
      </div>
      <header className="site-header">
        <div className="wrap bar">
          <a className="brand" href="#top" aria-label="Rapid Self Storage, back to top">
            <Mark />
            <span className="brand-text">
              <span className="brand-name">{site.name}</span>
              <span className="brand-sub">Tulare, California</span>
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
            <a className="btn btn-outline btn-sm" href={site.payUrl}>
              Pay bill
            </a>
            <a className="btn btn-blue btn-sm" href={site.reserveUrl}>
              Reserve a unit
            </a>
            <MobileMenu />
          </div>
        </div>
      </header>
    </>
  );
}
