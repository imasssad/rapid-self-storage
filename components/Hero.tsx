import Image from "next/image";
import type { ContactInfo, IconName, Photo, SiteContent } from "@/lib/content-schema";
import { gateHoursShort } from "@/lib/format";
import { Icon } from "./Icon";
import { SiteButton } from "./SiteButton";

type Props = {
  hero: SiteContent["home"]["hero"];
  highlights: SiteContent["home"]["highlights"];
  contact: ContactInfo;
  photo: Photo;
};

const factIcons: IconName[] = ["tag", "box", "people"];

export function Hero({ hero, highlights, contact, photo }: Props) {
  const facts = [
    { icon: "clock" as IconName, label: "Gate hours", value: gateHoursShort(contact) },
    ...hero.facts.map((f, i) => ({ ...f, icon: factIcons[i] })),
  ];
  return (
    <section className="hero">
      <div className="wrap">
        <div className="hero-frame">
          <Image src={photo.src} alt={photo.alt} fill preload sizes="(max-width: 1416px) 100vw, 1320px" />
          <div className="hero-shade" aria-hidden="true" />
          <div className="hero-inner">
            <div className="hero-copy">
              <p className="hero-pill">
                <span className="hero-pill-check">
                  <Icon name="check" className="icon-xs" />
                </span>
                {/* The four highlight titles, cycled with CSS. Screen readers get the plain list. */}
                <span className="rotator" aria-hidden="true">
                  {highlights.map((h) => (
                    <span key={h.title}>{h.title}</span>
                  ))}
                </span>
                <span className="sr-only">{highlights.map((h) => h.title).join(". ")}.</span>
              </p>
              <h1>
                {hero.headline} {hero.headlineAccent && <span className="accent">{hero.headlineAccent}</span>}
              </h1>
              <p className="hero-lede">{hero.intro}</p>
              <div className="actions">
                <SiteButton button={hero.button} contact={contact} className="btn btn-blue btn-lg" arrow />
                <SiteButton button={hero.secondButton} contact={contact} className="btn btn-ghost-light btn-lg" />
              </div>
            </div>

            <aside className="pay-card" aria-label="Customer login">
              <p className="pay-card-title">
                <span className="icon-chip icon-chip-glass">
                  <Icon name="key" />
                </span>
                {hero.tenantTitle}
              </p>
              <p>{hero.tenantText}</p>
              <SiteButton button={hero.tenantButton} contact={contact} className="btn btn-light" arrow />
            </aside>
          </div>
          {photo.credit && <span className="credit">Photo: {photo.credit}</span>}
        </div>

        <ul className="hero-facts" aria-label="At a glance">
          {facts.map((s) => (
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
