import type { IconName, SiteContent } from "@/lib/content-schema";
import { Icon } from "./Icon";

type Props = { why: SiteContent["home"]["why"]; highlights: SiteContent["home"]["highlights"] };

const icons: IconName[] = ["tag", "key", "people", "camera"];

export function Highlights({ why, highlights }: Props) {
  return (
    <section className="section why" aria-labelledby="why-title">
      <div className="wrap why-grid">
        <div className="why-copy" data-reveal>
          <p className="eyebrow">Why Rapid Self Storage</p>
          <h2 id="why-title">{why.heading}</h2>
          <div className="prose">
            {why.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <div className="why-stat">
            <strong>
              <span data-count="110">110</span>%
            </strong>
            <span>{why.satisfaction}</span>
          </div>
        </div>
        <ul className="why-cards">
          {highlights.map((h, i) => (
            <li key={i} className="card" data-reveal style={{ "--i": i } as React.CSSProperties}>
              <span className="icon-chip">
                <Icon name={icons[i]} />
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
