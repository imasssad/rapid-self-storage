// Whether a part of the homepage is showing on the website right now, in words. Used above an editor's preview
// and in the overview's list of parts.
import type { SiteContent } from "@/lib/content-schema";
import { specialsActive, specialsWindow } from "@/lib/format";
import type { ScreenKey } from "@/lib/screens";

const longDate = (ymd: string) =>
  new Date(`${ymd}T12:00:00Z`).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });

/** Null when the part shows normally. */
export function visibilityNote(screen: ScreenKey, c: SiteContent): { ok: boolean; text: string } | null {
  if (screen === "specials") {
    const s = c.specials;
    if (!s.headline) return { ok: false, text: "Not on the website: add a headline first." };
    if (!s.enabled) return { ok: false, text: "Not on the website: “Show the special on the website” is switched off." };
    const now = Date.now();
    const { from, until } = specialsWindow(s);
    if (now < from) return { ok: false, text: `Not on the website yet: it starts on ${longDate(s.startDate)}.` };
    if (now >= until) return { ok: false, text: `Not on the website: it ended on ${longDate(s.endDate)}.` };
    return specialsActive(s, now) ? { ok: true, text: "Switched on: it shows at the very top of the website." } : null;
  }
  if (screen === "reviews" && !c.reviews.items.some((r) => r.enabled)) {
    return { ok: false, text: "The reviews section is hidden until at least one review is switched on." };
  }
  if (screen === "strip" && !c.home.showAmenities) return { ok: false, text: "The strip is switched off, so it isn't on the website." };
  if (screen === "strip" && !c.home.amenities.length) return { ok: false, text: "The strip is hidden because it has no phrases." };
  if (screen === "faq" && !c.home.faq.items.length) return { ok: false, text: "This section is hidden because it has no questions." };
  return null;
}
