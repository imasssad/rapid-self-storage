import type { ContactInfo, SiteContent } from "@/lib/content-schema";
import { PhoneText } from "./PhoneText";
import { UnitPicker } from "./UnitPicker";

export function Units({ units, contact }: { units: SiteContent["units"]; contact: ContactInfo }) {
  return (
    <section className="section mist" id="units">
      <div className="wrap">
        <div className="section-head center" data-reveal>
          <p className="eyebrow">Unit sizes</p>
          <h2>{units.heading}</h2>
          {units.intro && <p className="lede">{units.intro}</p>}
        </div>
        <div data-reveal style={{ "--i": 1 } as React.CSSProperties}>
          <UnitPicker items={units.items} button={units.button} soldOutButton={units.soldOutButton} contact={contact} />
        </div>
        {units.note && (
          <p className="picker-note">
            <PhoneText text={units.note} phone={contact.phone} />
          </p>
        )}
      </div>
    </section>
  );
}
