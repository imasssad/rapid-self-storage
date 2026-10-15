import Image from "next/image";
import type { ContactInfo, Photo, SiteContent } from "@/lib/content-schema";
import { SiteButton } from "./SiteButton";

type Props = { cta: SiteContent["home"]["cta"]; contact: ContactInfo; photo: Photo };

export function CtaBand({ cta, contact, photo }: Props) {
  return (
    <section className="cta" id="reserve" aria-labelledby="cta-title">
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
              <SiteButton button={cta.button} contact={contact} className="btn btn-light btn-lg" arrow withNumber />
              <SiteButton button={cta.secondButton} contact={contact} className="btn btn-ghost-light btn-lg" arrow withNumber />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
