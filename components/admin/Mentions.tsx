"use client";

// On "Hours, phone, address & links": text typed elsewhere that mentions a time, opening days or a phone number. Those
// words don't change by themselves when the hours or number change, so they're listed here to check.
import type { SiteContent } from "@/lib/content-schema";
import { phoneDigits } from "@/lib/content-schema";
import { describePath } from "./screen-fields";

type Path = (string | number)[];
type Mention = { path: Path; text: string; kind: "phone" | "hours"; otherNumber: boolean };

const PHONE = /\(?\b\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}\b/g;
const HOURS = /\b\d{1,2}(:\d{2})?\s?(a\.?m\.?|p\.?m\.?)(?![a-z])|\b(days a week|seven days|7 days|every day|daily|365 days|weekends?|mondays?|tuesdays?|wednesdays?|thursdays?|fridays?|saturdays?|sundays?)\b/i;
// Filled in from this screen automatically, or not words at all.
const SKIP = new Set(["contact", "photos", "settings"]);
const SKIP_KEYS = new Set(["id", "src", "alt", "credit", "buttonUrl", "icon"]);

function find(content: SiteContent): Mention[] {
  const own = phoneDigits(content.contact.phone);
  const out: Mention[] = [];
  const walk = (v: unknown, path: Path) => {
    if (typeof v === "string") {
      const numbers = [...v.matchAll(PHONE)].map((m) => phoneDigits(m[0])).filter(Boolean);
      if (numbers.length) out.push({ path, text: v, kind: "phone", otherNumber: numbers.some((n) => n !== own) });
      else if (HOURS.test(v)) out.push({ path, text: v, kind: "hours", otherNumber: false });
      return;
    }
    if (Array.isArray(v)) v.forEach((x, i) => walk(x, [...path, i]));
    else if (v && typeof v === "object") {
      for (const [k, x] of Object.entries(v)) if (!SKIP_KEYS.has(k)) walk(x, [...path, k]);
    }
  };
  for (const [k, v] of Object.entries(content)) if (!SKIP.has(k)) walk(v, [k]);
  // The home page's own contact text is on this screen already.
  return out.filter((m) => !(m.path[0] === "home" && m.path[1] === "contact"));
}

export function Mentions({ content }: { content: SiteContent }) {
  const items = find(content)
    .map((m) => ({ ...m, where: describePath(m.path) }))
    .filter((m) => m.where);
  if (!items.length) return null;
  return (
    <section className="group mentions" aria-labelledby="mentions-title">
      <h2 id="mentions-title">Check text you typed elsewhere</h2>
      <p className="help">
        These words mention hours, opening days or a phone number. They were typed by hand, so they don&apos;t change when you change the hours or the phone
        number above. Open each one to check it still matches.
      </p>
      <ul className="mention-list">
        {items.map((m) => (
          <li key={m.path.join(".")}>
            <a href={m.where!.href}>{m.where!.label}</a>
            {m.otherNumber && <span className="mention-flag">Different phone number</span>}
            <q>{m.text.length > 160 ? `${m.text.slice(0, 157)}…` : m.text}</q>
          </li>
        ))}
      </ul>
    </section>
  );
}
