import { faqs, site } from "@/lib/site";
import { Icon } from "./Icon";

export function Faq() {
  return (
    <section className="section" id="faq">
      <div className="wrap faq-grid">
        <div className="faq-intro" data-reveal>
          <p className="eyebrow">FAQ</p>
          <h2>Questions, answered.</h2>
          <p className="lede">Can&apos;t find what you need? Our managers are happy to help.</p>
          <a className="btn btn-outline" href={site.phoneHref}>
            <Icon name="phone" className="icon-sm" />
            Call {site.phoneDisplay}
          </a>
        </div>
        <div className="faq-list">
          {faqs.map((f, i) => (
            <details
              key={f.q}
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
