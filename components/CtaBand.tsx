import Image from "next/image";
import type { ContactInfo, Photo, SiteContent } from "@/lib/content-schema";
import { phoneHref } from "@/lib/format";
import { Icon } from "./Icon";

type Props = { cta: SiteContent["home"]["cta"]; contact: ContactInfo; photo: Photo };

export function CtaBand({ cta, contact, photo }: Props) {
  return (
    <section className="cta" aria-labelledby="cta-title">
      <div className="wrap">
        <div className="cta-frame" data-reveal="zoom">
          <Image src={photo.src} alt="" fill sizes="(max-width: 1416px) 100vw, 1320px" />
          <div className="cta-shade" aria-hidden="true" />
          <div className="cta-glow" aria-hidden="true" />
          <div className="cta-inner">
            {cta.kicker && <p className="eyebrow">{cta.kicker}</p>}
            <h2 id="cta-title">{cta.heading}</h2>
            {cta.text && <p>{cta.text}</p>}
            <div className="actions">
              <a className="btn btn-light btn-lg" href={contact.reserveUrl}>
                Reserve now
                <Icon name="arrow" className="icon-arrow" />
              </a>
              <a className="btn btn-ghost-light btn-lg" href={phoneHref(contact.phone)}>
                <Icon name="phone" className="icon-sm" />
                Call {contact.phone}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
