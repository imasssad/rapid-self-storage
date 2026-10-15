import type { ContactInfo, IconName, SiteContent } from "@/lib/content-schema";
import { phoneHref } from "@/lib/format";
import { Icon } from "./Icon";

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
          <a className="btn btn-blue btn-lg" href={contact.reserveUrl}>
            Reserve a unit
            <Icon name="arrow" className="icon-arrow" />
          </a>
          <a className="btn btn-outline btn-lg" href={phoneHref(contact.phone)}>
            <Icon name="phone" className="icon-sm" />
            Call {contact.phone}
          </a>
        </div>
      </div>
    </section>
  );
}
