import { site, steps } from "@/lib/site";
import { Icon } from "./Icon";

export function Steps() {
  return (
    <section className="section" id="how" aria-labelledby="how-title">
      <div className="wrap">
        <div className="section-head center" data-reveal>
          <p className="eyebrow">How it works</p>
          <h2 id="how-title">Rent a unit in three easy steps.</h2>
        </div>
        <div className="steps-wrap">
          <span className="steps-line" data-reveal="line" aria-hidden="true" />
          <ol className="steps">
            {steps.map((s, i) => (
              <li key={s.title} className="step" data-reveal style={{ "--i": i + 1 } as React.CSSProperties}>
                <span className="step-badge">
                  <Icon name={s.icon} />
                  <span className="step-num">{i + 1}</span>
                </span>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
        <div className="actions steps-cta" data-reveal style={{ "--i": 4 } as React.CSSProperties}>
          <a className="btn btn-blue btn-lg" href={site.reserveUrl}>
            Reserve a unit
            <Icon name="arrow" className="icon-arrow" />
          </a>
          <a className="btn btn-outline btn-lg" href={site.phoneHref}>
            <Icon name="phone" className="icon-sm" />
            Call {site.phoneDisplay}
          </a>
        </div>
      </div>
    </section>
  );
}
