import type { SiteContent } from "@/lib/content-schema";
import { externalLinkProps } from "@/lib/links";
import { Icon } from "./Icon";

export function Locations({ locations }: { locations: SiteContent["locations"] }) {
  return (
    <section className="section mist" id="locations">
      <div className="wrap">
        <div className="section-head center" data-reveal>
          <p className="eyebrow">Locations</p>
          <h2>{locations.heading}</h2>
        </div>
        <ul className="places">
          {locations.items.map((l, i) => (
            <li
              key={i}
              className={l.highlight ? "place is-home" : "place"}
              data-reveal
              style={{ "--i": i } as React.CSSProperties}
            >
              <div className="place-top">
                <span className="icon-chip">
                  <Icon name="pin" />
                </span>
                {l.highlight && <span className="tag">You are here</span>}
              </div>
              <h3>{l.name}</h3>
              <p className="where">{l.where}</p>
              <p className="what">{l.description}</p>
              <a className={l.highlight ? "btn btn-light" : "btn btn-outline"} href={l.buttonUrl} {...externalLinkProps(l.buttonUrl)}>
                {l.buttonLabel}
                <Icon name="arrow" className="icon-arrow" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
