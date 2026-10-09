import Image from "next/image";
import { photos, site } from "@/lib/site";
import { Icon } from "./Icon";

export function CtaBand() {
  return (
    <section className="cta" aria-labelledby="cta-title">
      <div className="wrap">
        <div className="cta-frame" data-reveal="zoom">
          <Image src={photos.facility.src} alt="" fill sizes="(max-width: 1416px) 100vw, 1320px" />
          <div className="cta-shade" aria-hidden="true" />
          <div className="cta-glow" aria-hidden="true" />
          <div className="cta-inner">
            <p className="eyebrow">Ready to get started?</p>
            <h2 id="cta-title">Reserve your unit online in a few minutes.</h2>
            <p>No deposit, month-to-month terms, and a gate code that is yours alone.</p>
            <div className="actions">
              <a className="btn btn-light btn-lg" href={site.reserveUrl}>
                Reserve now
                <Icon name="arrow" className="icon-arrow" />
              </a>
              <a className="btn btn-ghost-light btn-lg" href={site.phoneHref}>
                <Icon name="phone" className="icon-sm" />
                Call {site.phoneDisplay}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
