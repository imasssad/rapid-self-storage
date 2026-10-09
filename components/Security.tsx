import Image from "next/image";
import { photos, security, site } from "@/lib/site";

export function Security() {
  return (
    <section className="section navy" id="security">
      <div className="wrap security-grid">
        <div>
          <p className="kicker">Security</p>
          <h2>Your things are important to us too.</h2>
          <p className="lede" style={{ marginTop: "1.25rem" }}>
            Modern high-resolution cameras cover the whole facility. Each tenant gets a unique gate code that logs every
            entry and exit, and our staff review footage and gate logs regularly.
          </p>
          <dl className="stats">
            {security.map((s) => (
              <div key={s.value}>
                <dt>{s.label}</dt>
                <dd>{s.value}</dd>
              </div>
            ))}
          </dl>
          <div className="offer">
            <div>
              <strong>Military and first responders save.</strong>
              <span>Bring a valid ID and ask the office about your discount.</span>
            </div>
            <a className="btn btn-light" href={site.phoneHref}>
              Call {site.phoneDisplay}
            </a>
          </div>
        </div>
        <div className="photo">
          <Image src={photos.door.src} alt={photos.door.alt} fill sizes="(max-width: 900px) 100vw, 520px" />
          <span className="credit">Photo: {photos.door.credit}</span>
        </div>
      </div>
    </section>
  );
}
