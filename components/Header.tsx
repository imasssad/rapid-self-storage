import type { ContactInfo, SiteContent } from "@/lib/content-schema";
import { gateHoursText, phoneHref } from "@/lib/format";
import { menuHref } from "@/lib/nav";
import { Brand } from "./Brand";
import { Icon } from "./Icon";
import { MobileMenu } from "./MobileMenu";
import { SiteButton } from "./SiteButton";

export function Header({ contact, navbar }: { contact: ContactInfo; navbar: SiteContent["navbar"] }) {
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
          <a className="brand" href="#top" aria-label={`${navbar.name}, back to top`}>
            <Brand navbar={navbar} contact={contact} />
          </a>
          <nav className="nav" aria-label="Main">
            {navbar.links.map((item, i) => (
              <a key={i} href={menuHref(item)}>
                {item.label}
              </a>
            ))}
          </nav>
          <div className="header-actions">
            <SiteButton button={navbar.secondButton} contact={contact} className="btn btn-outline btn-sm" />
            <SiteButton button={navbar.button} contact={contact} className="btn btn-blue btn-sm" />
            <MobileMenu
              links={navbar.links}
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
