import { site } from "@/lib/site";
import { ContactForm } from "./ContactForm";
import { Icon } from "./Icon";

export function Contact() {
  return (
    <section className="section mist" id="visit">
      <div className="wrap contact-grid">
        <div data-reveal>
          <p className="eyebrow">Contact</p>
          <h2>Visit the office or send us a note.</h2>
          <ul className="visit-info">
            <li>
              <span className="icon-chip"><Icon name="pin" /></span>
              <span className="visit-label">Address</span>
              <a href={site.mapsUrl} target="_blank" rel="noopener noreferrer">
                {site.address.street}, {site.address.city}, {site.address.region} {site.address.postalCode}
              </a>
            </li>
            <li>
              <span className="icon-chip"><Icon name="phone" /></span>
              <span className="visit-label">Phone</span>
              <a href={site.phoneHref}>{site.phoneDisplay}</a>
            </li>
            <li>
              <span className="icon-chip"><Icon name="clock" /></span>
              <span className="visit-label">Gate hours</span>
              <span>{site.gateHours}</span>
            </li>
            <li>
              <span className="icon-chip"><Icon name="instagram" /></span>
              <span className="visit-label">Instagram</span>
              <a href={site.instagram.url} target="_blank" rel="noopener noreferrer">
                {site.instagram.handle}
              </a>
            </li>
          </ul>
          <a className="btn btn-outline" href={site.mapsUrl} target="_blank" rel="noopener noreferrer">
            <Icon name="map" className="icon-sm" />
            Get directions
          </a>
        </div>
        <div className="form-panel" data-reveal style={{ "--i": 1 } as React.CSSProperties}>
          <h3>Send a message</h3>
          <p>We reply during office hours. For anything urgent, call the office.</p>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
