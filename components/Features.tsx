import Image from "next/image";
import { features, photos } from "@/lib/site";
import { Icon } from "./Icon";

export function Features() {
  return (
    <section className="section mist" id="features">
      <div className="wrap">
        <div className="section-head" data-reveal>
          <p className="eyebrow">Facility features</p>
          <h2>Built for getting in and out.</h2>
          <p className="lede">
            Whether you&apos;re storing holiday decorations in the off season or a whole house during a move, our goal
            is to exceed your expectations with secure, convenient and spotlessly clean units.
          </p>
        </div>
        <div className="bento">
          <figure className="photo bento-photo" data-reveal="clip">
            <Image src={photos.driveUp.src} alt={photos.driveUp.alt} fill sizes="(max-width: 1000px) 100vw, 440px" />
            <figcaption className="photo-tag">
              <Icon name="truck" className="icon-sm" />
              Ground-floor, drive-up units
            </figcaption>
            <span className="credit">Photo: {photos.driveUp.credit}</span>
          </figure>
          <ul className="bento-cards">
            {features.map((f, i) => (
              <li key={f.title} className="card" data-reveal style={{ "--i": i } as React.CSSProperties}>
                <span className="icon-chip">
                  <Icon name={f.icon} />
                </span>
                <h3>{f.title}</h3>
                <p>{f.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
