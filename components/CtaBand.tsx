import { site } from "@/lib/site";

export function CtaBand() {
  return (
    <section className="cta-band">
      <div className="wrap">
        <div>
          <h2>Ready when you are. Reserve online in a few minutes.</h2>
          <p>No deposit, month-to-month terms, and a gate code that is yours alone.</p>
        </div>
        <div className="actions">
          <a className="btn btn-light" href={site.reserveUrl}>
            Reserve a unit
          </a>
          <a className="btn btn-ghost-light" href={site.phoneHref}>
            Call {site.phoneDisplay}
          </a>
        </div>
      </div>
    </section>
  );
}
