// The admin panel is organised the way the owner sees the website: one screen per part of the homepage, in
// page order, plus business details and tools. Each screen edits one or more "scopes" (paths into the content),
// so a photo is edited together with the section it appears in. Used by the server (what a screen may save)
// and the browser (navigation, search). Field labels live in components/admin/screen-fields.ts.

export type ScreenKey =
  | "specials"
  | "hero"
  | "why"
  | "units"
  | "steps"
  | "features"
  | "strip"
  | "security"
  | "story"
  | "locations"
  | "reviews"
  | "faq"
  | "cta"
  | "contact"
  | "photos"
  | "settings";

export type Screen = {
  title: string;
  group: "page" | "business" | "tools";
  /** One plain sentence: what this is on the website. */
  blurb: string;
  /** Paths into the site content that this screen edits. */
  scopes: readonly (readonly string[])[];
  /** id of the section on the homepage, for "See it on the website". */
  anchor?: string;
  ownerOnly?: boolean;
  /** Extra words people might search for. */
  keywords: string[];
  /** What on this part of the page is set elsewhere or can't be changed, so nobody hunts for it. */
  note?: string;
};

export const screens: Record<ScreenKey, Screen> = {
  specials: {
    title: "Special offer bar",
    group: "page",
    blurb: "A short offer in a blue bar at the very top of the website, such as a move-in deal.",
    scopes: [["specials"]],
    anchor: "top",
    keywords: ["special", "offer", "deal", "promotion", "promo", "discount", "sale", "banner", "announcement", "coupon"],
  },
  hero: {
    title: "Top of the page",
    note: "Button words are fixed. Where “Reserve a unit” and “Customer login & pay” go is set in Hours, phone, address & links. The gate hours fact fills in from there too.",
    group: "page",
    blurb: "The big photo, headline, introduction and quick facts that visitors see first.",
    scopes: [["home", "hero"], ["photos", "hero"]],
    anchor: "top",
    keywords: ["headline", "title", "heading", "intro", "welcome", "big photo", "main photo", "picture", "image", "facts", "tenant", "pay"],
  },
  why: {
    title: "Why choose us",
    note: "The “110%” number and the small blue label above the heading are fixed.",
    group: "page",
    blurb: "Your welcome paragraphs, the “110%” line and the four reasons to choose you.",
    scopes: [["home", "why"], ["home", "highlights"]],
    anchor: "why",
    keywords: ["welcome", "about", "reasons", "benefits", "110", "satisfaction", "flat rate", "gate access", "service"],
  },
  units: {
    title: "Unit sizes & prices",
    note: "Button words are fixed. “Reserve this size” goes to your Reserve link (Hours, phone, address & links).",
    group: "page",
    blurb: "The sizes in the floor-plan picker, their monthly prices, and which ones are sold out.",
    scopes: [["units"]],
    anchor: "units",
    keywords: ["price", "prices", "cost", "rate", "rent", "monthly", "dollar", "$", "size", "sizes", "sold out", "waitlist", "unit", "5x5", "10x10", "20x20"],
  },
  steps: {
    title: "How it works",
    note: "The step numbers and the button are fixed. The button goes to your Reserve link.",
    group: "page",
    blurb: "The three steps to rent a unit.",
    scopes: [["home", "steps"]],
    anchor: "how",
    keywords: ["steps", "how", "process", "rent", "reserve"],
  },
  features: {
    title: "Facility features",
    group: "page",
    blurb: "“Features” in the website menu: the feature cards (drive-up units, staff, access…) and the photo next to them.",
    scopes: [["home", "features"], ["photos", "driveUp"]],
    anchor: "features",
    keywords: ["features", "amenities", "drive-up", "military", "discount", "moving supplies", "truck", "staff", "photo"],
  },
  strip: {
    title: "Scrolling strip",
    group: "page",
    blurb: "The blue strip of short phrases that scrolls across the page.",
    scopes: [["home", "amenities"], ["home", "showAmenities"]],
    anchor: "amenities",
    keywords: ["strip", "scrolling", "ticker", "marquee", "phrases", "blue bar", "moving text"],
  },
  security: {
    title: "Security",
    group: "page",
    blurb: "The dark blue security section: text, three big numbers and its photo.",
    scopes: [["home", "security"], ["photos", "door"]],
    anchor: "security",
    keywords: ["security", "cameras", "gate code", "safe", "24/7", "numbers", "photo"],
  },
  story: {
    title: "About us (our story)",
    group: "page",
    blurb: "“About” in the website menu: your company story and the timeline of years next to it.",
    scopes: [["about"]],
    anchor: "story",
    keywords: ["story", "about", "history", "timeline", "years", "company", "since"],
  },
  locations: {
    title: "Locations",
    note: "The Tulare card's address and button link are typed here separately from Hours, phone, address & links, so update both if they change.",
    group: "page",
    blurb: "This facility and your sister locations, shown as cards with buttons.",
    scopes: [["locations"]],
    anchor: "locations",
    keywords: ["locations", "visalia", "sister", "noble", "santa fe", "branches"],
  },
  reviews: {
    title: "Customer reviews",
    group: "page",
    blurb: "Quotes from real customers, between Locations and the FAQ. The section only appears once a review is switched on.",
    scopes: [["reviews"]],
    anchor: "reviews",
    keywords: ["reviews", "testimonials", "stars", "customers", "quotes", "rating"],
  },
  faq: {
    title: "Questions & answers (FAQ)",
    group: "page",
    blurb: "“FAQ” in the website menu: common questions with their answers.",
    scopes: [["home", "faq"]],
    anchor: "faq",
    keywords: ["faq", "questions", "answers", "help"],
  },
  cta: {
    title: "Bottom banner",
    note: "The button words are fixed. “Reserve now” goes to your Reserve link and the call button uses your phone number (Hours, phone, address & links).",
    group: "page",
    blurb: "The large “Reserve your unit” banner near the bottom, with its background photo.",
    scopes: [["home", "cta"], ["photos", "facility"]],
    anchor: "reserve",
    keywords: ["bottom", "banner", "reserve now", "call to action", "get started", "photo"],
  },
  contact: {
    title: "Hours, phone, address & links",
    group: "business",
    blurb: "Gate and office hours, phone, address and the Pay / Reserve button links. These appear all over the site, including “Contact” in the menu.",
    scopes: [["contact"], ["home", "contact"]],
    anchor: "visit",
    keywords: ["hours", "open", "gate", "office", "phone", "number", "call", "address", "map", "directions", "instagram", "pay", "bill", "reserve", "link", "storedge", "quikstor", "contact"],
  },
  photos: {
    title: "All photos",
    group: "business",
    blurb: "All four big photos on one screen. Each one can also be changed from its own section.",
    scopes: [["photos"]],
    keywords: ["photo", "photos", "picture", "pictures", "image", "images", "upload"],
  },
  settings: {
    title: "Contact form emails",
    group: "tools",
    blurb: "Which email addresses receive messages sent from the website's contact form.",
    scopes: [["settings"]],
    ownerOnly: true,
    keywords: ["email", "emails", "contact form", "messages", "inbox", "settings"],
  },
};

export const screenKeys = Object.keys(screens) as ScreenKey[];
export const isScreenKey = (v: string): v is ScreenKey => Object.hasOwn(screens, v);

/** Content section names, for labelling old history entries. */
export const legacySectionTitles: Record<string, string> = {
  specials: "Special offer bar",
  units: "Unit sizes & prices",
  contact: "Hours, phone & address",
  home: "Homepage text",
  photos: "Photos",
  about: "Our story & history",
  locations: "Locations",
  reviews: "Customer reviews",
  settings: "Contact form emails",
};

export function getAt(obj: unknown, path: readonly (string | number)[]): unknown {
  return path.reduce<unknown>((o, k) => (o as Record<string | number, unknown> | undefined)?.[k], obj);
}

export function setAt<T>(obj: T, path: readonly (string | number)[], value: unknown): T {
  if (!path.length) return value as T;
  const [k, ...rest] = path;
  const src = obj as Record<string | number, unknown>;
  const copy = (Array.isArray(obj) ? [...(obj as unknown[])] : { ...(obj as object) }) as Record<string | number, unknown>;
  copy[k] = setAt(src?.[k], rest, value);
  return copy as T;
}
