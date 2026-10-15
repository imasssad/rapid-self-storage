import Image from "next/image";
import type { Photo, SiteContent } from "@/lib/content-schema";
import { Icon } from "./Icon";

export function Features({ features, photo }: { features: SiteContent["home"]["features"]; photo: Photo }) {
  return (
    <section className="section mist" id="features">
      <div className="wrap">
        <div className="section-head" data-reveal>
          <p className="eyebrow">Facility features</p>
          <h2>{features.heading}</h2>
          {features.intro && <p className="lede">{features.intro}</p>}
        </div>
        <div className="bento">
          <figure className="photo bento-photo" data-reveal="clip">
            <Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 1000px) 100vw, 440px" />
            {features.photoTag && (
              <figcaption className="photo-tag">
                <Icon name="truck" className="icon-sm" />
                {features.photoTag}
              </figcaption>
            )}
            {photo.credit && <span className="credit">Photo: {photo.credit}</span>}
          </figure>
          <ul className="bento-cards">
            {features.items.map((f, i) => (
              <li key={i} className="card" data-reveal style={{ "--i": i } as React.CSSProperties}>
                <span className="icon-chip">
                  <Icon name={f.icon} />
                </span>
                <h3>{f.title}</h3>
                <p>{f.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
