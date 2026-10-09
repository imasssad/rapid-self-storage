import { locations } from "@/lib/site";
import { Icon } from "./Icon";

export function Locations() {
  return (
    <section className="section mist" id="locations">
      <div className="wrap">
        <div className="section-head center" data-reveal>
          <p className="eyebrow">Locations</p>
          <h2>One family of facilities across Tulare and Visalia.</h2>
        </div>
        <ul className="places">
          {locations.map((l, i) => (
            <li
              key={l.name}
              className={l.primary ? "place is-home" : "place"}
              data-reveal
              style={{ "--i": i } as React.CSSProperties}
            >
              <div className="place-top">
                <span className="icon-chip">
                  <Icon name="pin" />
                </span>
                {l.primary && <span className="tag">You are here</span>}
              </div>
              <h3>{l.name}</h3>
              <p className="where">{l.where}</p>
              <p className="what">{l.what}</p>
              <a className={l.primary ? "btn btn-light" : "btn btn-outline"} href={l.href}>
                {l.cta}
                <Icon name="arrow" className="icon-arrow" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
