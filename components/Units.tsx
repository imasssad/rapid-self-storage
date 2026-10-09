import { UnitPicker } from "./UnitPicker";
import { site } from "@/lib/site";

export function Units() {
  return (
    <section className="section mist" id="units">
      <div className="wrap">
        <div className="section-head center" data-reveal>
          <p className="eyebrow">Unit sizes</p>
          <h2>Pick a size and see the floor plan.</h2>
          <p className="lede">
            From small 5×5 to oversized 20×20, every plan is drawn on a one-foot grid so you can compare at a glance.
            Not sure what fits? Our managers help people choose every day.
          </p>
        </div>
        <div data-reveal style={{ "--i": 1 } as React.CSSProperties}>
          <UnitPicker />
        </div>
        <p className="picker-note">
          Availability and rates change. Call <a className="text-link" href={site.phoneHref}>{site.phoneDisplay}</a>{" "}
          for current pricing.
        </p>
      </div>
    </section>
  );
}
