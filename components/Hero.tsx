import Image from "next/image";
import { photos, site, specs } from "@/lib/site";

export function Hero() {
  const facts = specs.slice(0, 3);
  return (
    <section className="hero">
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <p className="kicker">Self storage in Tulare, California</p>
          <h1>Drive up, unload and get on with your day.</h1>
          <p className="lede">
            Clean, secure ground-floor units from 5×5 to 20×20, a personal gate code for every tenant, and a friendly
            team on site six days a week. Rent month to month with no deposit.
          </p>
          <div className="actions">
            <a className="btn btn-blue" href={site.reserveUrl}>
              Reserve a unit
            </a>
            <a className="btn btn-outline" href="#units">
              Find your size
            </a>
          </div>
          <dl className="facts">
            {facts.map((f) => (
              <div key={f.label}>
                <dt>{f.label}</dt>
                <dd>{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="hero-media">
          <div className="photo">
            <Image
              src={photos.hero.src}
              alt={photos.hero.alt}
              fill
              priority
              sizes="(max-width: 900px) 100vw, 620px"
            />
            <span className="credit">Photo: {photos.hero.credit}</span>
          </div>
          <div className="pay-panel">
            <p>
              <strong>Already a tenant?</strong>
              Pay online or set up auto-pay in the customer portal.
            </p>
            <a className="btn btn-blue" href={site.payUrl}>
              Pay your bill
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
