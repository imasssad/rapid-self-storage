import type { ContactInfo, SiteContent } from "@/lib/content-schema";
import { gateHoursText, officeHoursLines, phoneHref } from "@/lib/format";
import { ContactForm } from "./ContactForm";
import { Icon } from "./Icon";
import { SiteButton } from "./SiteButton";

type Props = {
  section: SiteContent["home"]["contact"];
  contact: ContactInfo;
  locations: SiteContent["locations"]["items"];
};

export function Contact({ section, contact, locations }: Props) {
  const office = officeHoursLines(contact.officeHours);
  // The facility's own location reads "Tulare, 1682 N J St"; sister locations use their names.
  const options = locations.map((l) => ({
    value: l.name,
    label: l.highlight ? `${contact.city}, ${contact.street}` : l.name,
  }));
  return (
    <section className="section mist" id="visit">
      <div className="wrap contact-grid">
        <div data-reveal>
          <p className="eyebrow">Contact</p>
          <h2>{section.heading}</h2>
          <ul className="visit-info">
            <li>
              <span className="icon-chip"><Icon name="pin" /></span>
              <span className="visit-label">Address</span>
              <a href={contact.mapsUrl} target="_blank" rel="noopener noreferrer">
                {contact.street}, {contact.city}, {contact.region} {contact.postalCode}
              </a>
            </li>
            <li>
              <span className="icon-chip"><Icon name="phone" /></span>
              <span className="visit-label">Phone</span>
              <a href={phoneHref(contact.phone)}>{contact.phone}</a>
            </li>
            <li>
              <span className="icon-chip"><Icon name="clock" /></span>
              <span className="visit-label">Gate hours</span>
              <span>{gateHoursText(contact)}</span>
            </li>
            {office.length > 0 && (
              <li>
                <span className="icon-chip"><Icon name="people" /></span>
                <span className="visit-label">Office hours</span>
                <span>
                  {office.map((line, i) => (
                    <span key={i} className="office-line">
                      {line}
                    </span>
                  ))}
                </span>
              </li>
            )}
            {contact.instagramUrl && (
              <li>
                <span className="icon-chip"><Icon name="instagram" /></span>
                <span className="visit-label">Instagram</span>
                <a href={contact.instagramUrl} target="_blank" rel="noopener noreferrer">
                  {contact.instagramHandle || "Instagram"}
                </a>
              </li>
            )}
          </ul>
          <SiteButton button={section.button} contact={contact} className="btn btn-outline" withNumber />
        </div>
        <div className="form-panel" data-reveal style={{ "--i": 1 } as React.CSSProperties}>
          <h3>Send a message</h3>
          {section.formIntro && <p>{section.formIntro}</p>}
          <ContactForm locations={options} phone={contact.phone} />
        </div>
      </div>
    </section>
  );
}
