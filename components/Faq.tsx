import type { ContactInfo, SiteContent } from "@/lib/content-schema";
import { phoneHref } from "@/lib/format";
import { Icon } from "./Icon";

export function Faq({ faq, contact }: { faq: SiteContent["home"]["faq"]; contact: ContactInfo }) {
  if (!faq.items.length) return null;
  return (
    <section className="section" id="faq">
      <div className="wrap faq-grid">
        <div className="faq-intro" data-reveal>
          <p className="eyebrow">FAQ</p>
          <h2>{faq.heading}</h2>
          {faq.intro && <p className="lede">{faq.intro}</p>}
          <a className="btn btn-outline" href={phoneHref(contact.phone)}>
            <Icon name="phone" className="icon-sm" />
            Call {contact.phone}
          </a>
        </div>
        <div className="faq-list">
          {faq.items.map((f, i) => (
            <details
              key={i}
              name="faq"
              className="faq-item"
              open={i === 0}
              data-reveal
              style={{ "--i": i } as React.CSSProperties}
            >
              <summary>
                {f.q}
                <span className="faq-toggle" aria-hidden="true" />
              </summary>
              <p className="faq-answer">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
