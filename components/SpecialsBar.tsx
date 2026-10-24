import type { Specials } from "@/lib/content-schema";
import { specialsActive, specialsWindow } from "@/lib/format";
import { externalLinkProps } from "@/lib/links";
import { Icon } from "./Icon";

// The page is cached for up to an hour, so the server's on/off decision can be slightly stale around midnight.
// The inline script re-checks the dates against the visitor's clock before the bar is painted.
const recheck = `(function(){var e=document.getElementById("specials-bar");if(!e)return;var n=Date.now(),f=Number(e.getAttribute("data-from")),u=Number(e.getAttribute("data-until"));e.hidden=!(n>=f&&n<u)})()`;

/** `preview` (admin panel) draws the bar even when it's switched off or out of its dates, without the script. */
/** A button with a label but no link of its own goes to the "Reserve a unit" page. */
export function SpecialsBar({ specials, now, reserveUrl, preview = false }: { specials: Specials; now: number; reserveUrl: string; preview?: boolean }) {
  if (!specials.headline) return null;
  if (!preview && !specials.enabled) return null;
  const { from, until } = specialsWindow(specials);
  if (!preview && until <= now) return null; // already over; nothing to re-check
  return (
    <>
      <aside
        id="specials-bar"
        className="specials"
        aria-label="Current special"
        data-from={Number.isFinite(from) ? from : -8.64e15}
        data-until={Number.isFinite(until) ? until : 8.64e15}
        hidden={!preview && !specialsActive(specials, now)}
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
          {specials.buttonLabel && (specials.buttonUrl || reserveUrl) && (
            <a className="specials-link" href={specials.buttonUrl || reserveUrl} {...externalLinkProps(specials.buttonUrl || reserveUrl)}>
              {specials.buttonLabel}
              <Icon name="arrow" className="icon-xs" />
            </a>
          )}
        </div>
      </aside>
      {!preview && <script dangerouslySetInnerHTML={{ __html: recheck }} />}
    </>
  );
}
