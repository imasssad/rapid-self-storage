import { highlights } from "@/lib/site";
import { Icon } from "./Icon";

export function Highlights() {
  return (
    <section className="mist" aria-label="Why Rapid Self Storage">
      <div className="wrap">
        <ul className="highlights">
          {highlights.map((h) => (
            <li key={h.title}>
              <Icon name={h.icon} />
              <h3>{h.title}</h3>
              <p>{h.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
