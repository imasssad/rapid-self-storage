import Image from "next/image";
import { photos, security } from "@/lib/site";
import { Icon } from "./Icon";

export function Security() {
  return (
    <section className="section navy security" id="security">
      <div className="wrap security-grid">
        <div data-reveal>
          <p className="eyebrow">Security</p>
          <h2>Your things are important to us too.</h2>
          <p className="lede">
            The highest-resolution, most modern cameras cover the whole facility. Each tenant gets a unique gate code
            that logs every entry and exit, and our staff review footage and gate logs regularly.
          </p>
          <ul className="stats">
            {security.map((s, i) => {
              const m = /^(\d+)(.*)$/.exec(s.value);
              const n = m ? Number(m[1]) : 0;
              return (
                <li key={s.value} className="stat" data-reveal style={{ "--i": i + 1 } as React.CSSProperties}>
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
            <Image src={photos.door.src} alt={photos.door.alt} fill sizes="(max-width: 1000px) 100vw, 560px" />
            <span className="credit">Photo: {photos.door.credit}</span>
          </div>
          <div className="float-badge">
            <span className="icon-chip">
              <Icon name="shield" />
            </span>
            <span>
              <strong>Unique gate code</strong>
              Every entry and exit is logged
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
