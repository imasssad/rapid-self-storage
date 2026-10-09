import { locations } from "@/lib/site";

export function Locations() {
  return (
    <section className="section mist" id="locations">
      <div className="wrap">
        <div className="section-head">
          <p className="kicker">Locations</p>
          <h2>One family of facilities across Tulare and Visalia.</h2>
        </div>
        <ul className="places">
          {locations.map((l) => (
            <li key={l.name} className={l.primary ? "place is-home" : "place"}>
              {l.primary && <span className="tag">You are here</span>}
              <h3>{l.name}</h3>
              <p className="where">{l.where}</p>
              <p className="what">{l.what}</p>
              <a className={l.primary ? "btn btn-blue" : "btn btn-outline"} href={l.href}>
                {l.cta}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
