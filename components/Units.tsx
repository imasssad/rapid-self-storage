import { UnitPicker } from "./UnitPicker";
import { site } from "@/lib/site";

export function Units() {
  return (
    <section className="section" id="units">
      <div className="wrap">
        <div className="section-head">
          <p className="kicker">Unit sizes</p>
          <h2>Pick a size and see the floor plan.</h2>
          <p className="lede">
            Every plan is drawn on a one-foot grid, so you can compare sizes at a glance. Not sure what fits? Our
            managers help people choose every day.
          </p>
        </div>
        <UnitPicker />
        <p className="picker-note">
          Availability and rates change. Call <a className="text-link" href={site.phoneHref}>{site.phoneDisplay}</a>{" "}
          for current pricing.
        </p>
      </div>
    </section>
  );
}
