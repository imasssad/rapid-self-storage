import { site } from "@/lib/site";
import { Icon } from "./Icon";

// Phone-only call/reserve bar. It slides in once the hero is scrolled past (data-past-hero, set by Motion).
export function MobileCta() {
  return (
    <div className="mobile-cta">
      <a className="btn btn-outline" href={site.phoneHref}>
        <Icon name="phone" className="icon-sm" />
        Call
      </a>
      <a className="btn btn-blue" href={site.reserveUrl}>
        Reserve a unit
      </a>
    </div>
  );
}
