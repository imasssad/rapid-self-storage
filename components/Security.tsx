import Image from "next/image";
import type { Photo, SiteContent } from "@/lib/content-schema";
import { Icon } from "./Icon";

export function Security({ security, photo }: { security: SiteContent["home"]["security"]; photo: Photo }) {
  return (
    <section className="section navy security" id="security">
      <div className="wrap security-grid">
        <div data-reveal>
          <p className="eyebrow">Security</p>
          <h2>{security.heading}</h2>
          <p className="lede">{security.text}</p>
          <ul className="stats">
            {security.stats.map((s, i) => {
              const m = /^(\d+)(.*)$/.exec(s.value);
              const n = m ? Number(m[1]) : 0;
              return (
                <li key={i} className="stat" data-reveal style={{ "--i": i + 1 } as React.CSSProperties}>
                  <strong>
                    {m && n >= 10 ? (
                      <>
                        <span data-count={n}>{n}</span>
                        {m[2]}
                      </>
                    ) : (
                      s.value
                    )}
                  </strong>
                  <span>{s.label}</span>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="security-media" data-reveal="right">
          <div className="photo">
            <Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 1000px) 100vw, 560px" />
            {photo.credit && <span className="credit">Photo: {photo.credit}</span>}
          </div>
          {security.badgeTitle && (
            <div className="float-badge">
              <span className="icon-chip">
                <Icon name="shield" />
              </span>
              <span>
                <strong>{security.badgeTitle}</strong>
                {security.badgeText}
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
