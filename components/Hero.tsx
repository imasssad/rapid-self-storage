import Image from "next/image";
import { highlights, photos, site, specs } from "@/lib/site";
import { Icon } from "./Icon";

export function Hero() {
  return (
    <section className="hero">
      <div className="wrap">
        <div className="hero-frame">
          <Image src={photos.hero.src} alt={photos.hero.alt} fill preload sizes="(max-width: 1416px) 100vw, 1320px" />
          <div className="hero-shade" aria-hidden="true" />
          <div className="hero-inner">
            <div className="hero-copy">
              <p className="hero-pill">
                <span className="hero-pill-check">
                  <Icon name="check" className="icon-xs" />
                </span>
                {/* The old site's slider taglines, cycled with CSS. Screen readers get the plain list. */}
                <span className="rotator" aria-hidden="true">
                  {highlights.map((h) => (
                    <span key={h.title}>{h.title}</span>
                  ))}
                </span>
                <span className="sr-only">{highlights.map((h) => h.title).join(". ")}.</span>
              </p>
              <h1>
                Drive up, unload and <span className="accent">get on with your day.</span>
              </h1>
              <p className="hero-lede">
                {site.tagline} Clean ground-floor units from 5×5 to 20×20, a personal gate code for every tenant, and
                friendly managers on site six days a week.
              </p>
              <div className="actions">
                <a className="btn btn-blue btn-lg" href={site.reserveUrl}>
                  Reserve a unit
                  <Icon name="arrow" className="icon-arrow" />
                </a>
                <a className="btn btn-ghost-light btn-lg" href="#units">
                  Find your size
                </a>
              </div>
            </div>

            <aside className="pay-card" aria-label="Customer login">
              <p className="pay-card-title">
                <span className="icon-chip icon-chip-glass">
                  <Icon name="key" />
                </span>
                Already a tenant?
              </p>
              <p>Log in to pay online, set up auto-pay or manage your unit.</p>
              <a className="btn btn-light" href={site.payUrl}>
                Customer login &amp; pay
                <Icon name="arrow" className="icon-arrow" />
              </a>
            </aside>
          </div>
          <span className="credit">Photo: {photos.hero.credit}</span>
        </div>

        <ul className="hero-facts" aria-label="At a glance">
          {specs.map((s) => (
            <li key={s.label}>
              <span className="icon-chip">
                <Icon name={s.icon} />
              </span>
              <span className="fact-label">{s.label}</span>
              <strong>{s.value}</strong>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
