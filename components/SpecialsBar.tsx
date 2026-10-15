import type { Specials } from "@/lib/content-schema";
import { specialsActive, specialsWindow } from "@/lib/format";
import { Icon } from "./Icon";

// The page is cached for up to an hour, so the server's on/off decision can be slightly stale around midnight.
// The inline script re-checks the dates against the visitor's clock before the bar is painted.
const recheck = `(function(){var e=document.getElementById("specials-bar");if(!e)return;var n=Date.now(),f=Number(e.getAttribute("data-from")),u=Number(e.getAttribute("data-until"));e.hidden=!(n>=f&&n<u)})()`;

export function SpecialsBar({ specials, now }: { specials: Specials; now: number }) {
  if (!specials.enabled || !specials.headline) return null;
  const { from, until } = specialsWindow(specials);
  if (until <= now) return null; // already over; nothing to re-check
  return (
    <>
      <aside
        id="specials-bar"
        className="specials"
        aria-label="Current special"
        data-from={Number.isFinite(from) ? from : -8.64e15}
        data-until={Number.isFinite(until) ? until : 8.64e15}
        hidden={!specialsActive(specials, now)}
        suppressHydrationWarning
      >
        <div className="wrap specials-inner">
          <span className="specials-tag">
            <Icon name="tag" className="icon-xs" />
            Special
          </span>
          <p>
            <strong>{specials.headline}</strong>
            {specials.text && <span> {specials.text}</span>}
          </p>
          {specials.buttonLabel && specials.buttonUrl && (
            <a className="specials-link" href={specials.buttonUrl}>
              {specials.buttonLabel}
              <Icon name="arrow" className="icon-xs" />
            </a>
          )}
        </div>
      </aside>
      <script dangerouslySetInnerHTML={{ __html: recheck }} />
    </>
  );
}
