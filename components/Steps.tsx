import type { ContactInfo, IconName, SiteContent } from "@/lib/content-schema";
import { Icon } from "./Icon";
import { SiteButton } from "./SiteButton";

const icons: IconName[] = ["box", "calendar", "key"];

export function Steps({ steps, contact }: { steps: SiteContent["home"]["steps"]; contact: ContactInfo }) {
  return (
    <section className="section" id="how" aria-labelledby="how-title">
      <div className="wrap">
        <div className="section-head center" data-reveal>
          <p className="eyebrow">How it works</p>
          <h2 id="how-title">{steps.heading}</h2>
        </div>
        <div className="steps-wrap">
          <span className="steps-line" data-reveal="line" aria-hidden="true" />
          <ol className="steps">
            {steps.items.map((s, i) => (
              <li key={i} className="step" data-reveal style={{ "--i": i + 1 } as React.CSSProperties}>
                <span className="step-badge">
                  <Icon name={icons[i]} />
                  <span className="step-num">{i + 1}</span>
                </span>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
        <div className="actions steps-cta" data-reveal style={{ "--i": 4 } as React.CSSProperties}>
          <SiteButton button={steps.button} contact={contact} className="btn btn-blue btn-lg" arrow withNumber />
          <SiteButton button={steps.secondButton} contact={contact} className="btn btn-outline btn-lg" arrow withNumber />
        </div>
      </div>
    </section>
  );
}
