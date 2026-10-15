// Small display helpers shared by the public site and the admin panel.
import { phoneDigits, type ContactInfo, type Specials } from "./content-schema";

export const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] as const;
const SHORT_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/** "06:00" → "6 AM", "17:30" → "5:30 PM". */
export function formatTime(hhmm: string): string {
  const [h, m] = hhmm.split(":").map(Number);
  const suffix = h < 12 ? "AM" : "PM";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return m ? `${hour}:${String(m).padStart(2, "0")} ${suffix}` : `${hour} ${suffix}`;
}

/** "6 AM to 8 PM, every day" */
export function gateHoursText(c: Pick<ContactInfo, "gateOpens" | "gateCloses">): string {
  return `${formatTime(c.gateOpens)} to ${formatTime(c.gateCloses)}, every day`;
}

/** "6 AM to 8 PM daily" (the short form used in the hero facts). */
export function gateHoursShort(c: Pick<ContactInfo, "gateOpens" | "gateCloses">): string {
  return `${formatTime(c.gateOpens)} to ${formatTime(c.gateCloses)} daily`;
}

export function phoneHref(phone: string): string {
  const d = phoneDigits(phone);
  return d ? `tel:+1${d}` : `tel:${phone.replace(/[^\d+]/g, "")}`;
}

/** "+1-559-688-4787" for structured data. */
export function phoneE164Dashed(phone: string): string | undefined {
  const d = phoneDigits(phone);
  return d ? `+1-${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}` : undefined;
}

/** Groups consecutive days with the same hours: ["Mon–Fri 9 AM to 5 PM", "Sat 10 AM to 2 PM"]. Empty when closed all week. */
export function officeHoursLines(days: ContactInfo["officeHours"]): string[] {
  const lines: string[] = [];
  let i = 0;
  while (i < 7) {
    const d = days[i];
    if (!d.open) {
      i++;
      continue;
    }
    let j = i;
    while (j + 1 < 7 && days[j + 1].open && days[j + 1].opens === d.opens && days[j + 1].closes === d.closes) j++;
    const label = i === j ? SHORT_DAYS[i] : `${SHORT_DAYS[i]}–${SHORT_DAYS[j]}`;
    lines.push(`${label} ${formatTime(d.opens)} to ${formatTime(d.closes)}`);
    i = j + 1;
  }
  return lines;
}

export function formatPrice(price: number): string {
  return `$${price.toLocaleString("en-US")}`;
}

// ---- Specials dates. Dates are whole days in California time. ----

const TZ = "America/Los_Angeles";

function tzOffsetMs(utcMs: number): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TZ,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(new Date(utcMs));
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value);
  return Date.UTC(get("year"), get("month") - 1, get("day"), get("hour"), get("minute"), get("second")) - utcMs;
}

/** The UTC instant of midnight at the start of a YYYY-MM-DD day in California. */
export function startOfDayLA(date: string, addDays = 0): number {
  const [y, m, d] = date.split("-").map(Number);
  const wall = Date.UTC(y, m - 1, d + addDays);
  let t = wall - tzOffsetMs(wall);
  const corrected = wall - tzOffsetMs(t); // second pass handles the DST switch days
  if (corrected !== t) t = corrected;
  return t;
}

/** [from, until) in epoch ms; open ends are ±Infinity. */
export function specialsWindow(s: Pick<Specials, "startDate" | "endDate">): { from: number; until: number } {
  return {
    from: s.startDate ? startOfDayLA(s.startDate) : -Infinity,
    until: s.endDate ? startOfDayLA(s.endDate, 1) : Infinity,
  };
}

export function specialsActive(s: Specials, now: number): boolean {
  if (!s.enabled || !s.headline) return false;
  const { from, until } = specialsWindow(s);
  return now >= from && now < until;
}

/** Today's date in California as YYYY-MM-DD. */
export function todayLA(now = Date.now()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(now));
}
