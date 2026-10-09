import { about, highlights } from "@/lib/site";
import { Icon } from "./Icon";

export function Highlights() {
  return (
    <section className="section why" aria-labelledby="why-title">
      <div className="wrap why-grid">
        <div className="why-copy" data-reveal>
          <p className="eyebrow">Why Rapid Self Storage</p>
          <h2 id="why-title">Convenient, safe and affordable, right here in Tulare.</h2>
          <div className="prose">
            {about.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>
          <div className="why-stat">
            <strong>
              <span data-count="110">110</span>%
            </strong>
            <span>
              Features aside, we have one focus: the complete satisfaction of every customer.
            </span>
          </div>
        </div>
        <ul className="why-cards">
          {highlights.map((h, i) => (
            <li key={h.title} className="card" data-reveal style={{ "--i": i } as React.CSSProperties}>
              <span className="icon-chip">
                <Icon name={h.icon} />
              </span>
              <h3>{h.title}</h3>
              <p>{h.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
