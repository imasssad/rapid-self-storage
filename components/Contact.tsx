import { site } from "@/lib/site";
import { ContactForm } from "./ContactForm";
import { Icon } from "./Icon";

export function Contact() {
  return (
    <section className="section" id="visit">
      <div className="wrap contact-grid">
        <div>
          <p className="kicker">Contact</p>
          <h2 style={{ marginTop: "1rem" }}>Visit the office or send us a note.</h2>
          <dl className="visit-info">
            <div>
              <span className="icon-chip"><Icon name="pin" /></span>
              <dt>Address</dt>
              <dd>
                <a href={site.mapsUrl} target="_blank" rel="noopener noreferrer">
                  {site.address.street}, {site.address.city}, {site.address.region} {site.address.postalCode}
                </a>
              </dd>
            </div>
            <div>
              <span className="icon-chip"><Icon name="phone" /></span>
              <dt>Phone</dt>
              <dd>
                <a href={site.phoneHref}>{site.phoneDisplay}</a>
              </dd>
            </div>
            <div>
              <span className="icon-chip"><Icon name="clock" /></span>
              <dt>Gate hours</dt>
              <dd>{site.gateHours}</dd>
            </div>
            <div>
              <span className="icon-chip"><Icon name="instagram" /></span>
              <dt>Instagram</dt>
              <dd>
                <a href={site.instagram.url} target="_blank" rel="noopener noreferrer">
                  {site.instagram.handle}
                </a>
              </dd>
            </div>
          </dl>
        </div>
        <div className="form-panel">
          <h3>Send a message</h3>
          <p>We reply during office hours. For anything urgent, call the office.</p>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
