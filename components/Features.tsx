import Image from "next/image";
import { features, photos } from "@/lib/site";
import { Icon } from "./Icon";

export function Features() {
  return (
    <section className="section mist" id="features">
      <div className="wrap split">
        <div className="photo">
          <Image src={photos.driveUp.src} alt={photos.driveUp.alt} fill sizes="(max-width: 900px) 100vw, 600px" />
          <span className="credit">Photo: {photos.driveUp.credit}</span>
        </div>
        <div>
          <p className="kicker">Facility features</p>
          <h2>Built for getting in and out.</h2>
          <ul className="feature-list">
            {features.map((f) => (
              <li key={f.title}>
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
