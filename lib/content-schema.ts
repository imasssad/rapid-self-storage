// The one schema for everything editable on the website. It's the source of the TypeScript types, the admin
// form validation (client side) and the server-side validation of every save. Messages are written for the
// site owner, not for developers.
import { z } from "zod";

const text = (max: number) => z.string().trim().max(max, `Keep this under ${max} characters.`);
const required = (max: number) => text(max).min(1, "This can't be empty.");

const link = z
  .string()
  .trim()
  .max(500, "This link is too long.")
  .refine((v) => /^(https:\/\/[^\s]+|tel:\+?[0-9-]+)$/i.test(v), "Use a full link that starts with https://");
const optionalLink = z.union([z.literal(""), link]);

const date = z.union([z.literal(""), z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Pick a date.")]);
const time = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Pick a time.");
const id = z.string().regex(/^[a-z0-9-]{1,40}$/);

export const iconNames = [
  "tag",
  "key",
  "people",
  "camera",
  "truck",
  "clock",
  "pin",
  "box",
  "shield",
  "medal",
  "calendar",
] as const;
export type IconName = (typeof iconNames)[number];

/**
 * Where a button can go. Most follow the shared settings (Reserve and Pay links, phone, Google Maps link), so a
 * change there updates every button; "link" uses the button's own web address.
 */
export const buttonTargets = ["reserve", "pay", "call", "directions", "sizes", "contact", "link"] as const;
export type ButtonTarget = (typeof buttonTargets)[number];

export const buttonSchema = z
  .object({ label: required(40), to: z.enum(buttonTargets), url: optionalLink })
  .refine((b) => b.to !== "link" || b.url, { message: "Add the web address, or choose another place for the button.", path: ["url"] });
export type SiteButton = z.infer<typeof buttonSchema>;

/** Digits of a US phone number, or null when it isn't one. */
export function phoneDigits(v: string): string | null {
  const d = v.replace(/\D/g, "");
  if (d.length === 10) return d;
  if (d.length === 11 && d.startsWith("1")) return d.slice(1);
  return null;
}

// ---- Sections. Each one is saved on its own from its own admin screen. ----

export const specialsSchema = z
  .object({
    enabled: z.boolean(),
    headline: text(90),
    text: text(220),
    buttonLabel: text(40),
    buttonUrl: optionalLink,
    startDate: date,
    endDate: date,
  })
  .superRefine((s, ctx) => {
    if (s.enabled && !s.headline) {
      ctx.addIssue({ code: "custom", path: ["headline"], message: "Add a headline before switching the special on." });
    }
    if (s.startDate && s.endDate && s.endDate < s.startDate) {
      ctx.addIssue({ code: "custom", path: ["endDate"], message: "The end date is before the start date." });
    }
  });

const unitSchema = z.object({
  id,
  width: z.number({ error: "Enter the width in feet." }).int("Use whole feet.").min(1).max(60),
  depth: z.number({ error: "Enter the depth in feet." }).int("Use whole feet.").min(1).max(60),
  name: required(40),
  description: text(160),
  price: z.number().int("Use whole dollars.").min(0, "The price can't be negative.").max(100000).nullable(),
  soldOut: z.boolean(),
});

export const unitsSchema = z.object({
  heading: required(120),
  intro: text(400),
  note: text(200),
  button: buttonSchema,
  soldOutButton: buttonSchema,
  items: z.array(unitSchema).min(1, "Keep at least one size.").max(20, "That's the most sizes the page can show."),
});

const dayHoursSchema = z
  .object({ open: z.boolean(), opens: time, closes: time })
  .refine((d) => !d.open || d.closes > d.opens, { message: "Closing time must be after opening time.", path: ["closes"] });

export const contactSchema = z
  .object({
    phone: required(30).refine((v) => phoneDigits(v) !== null, "Enter a 10-digit phone number."),
    street: required(80),
    city: required(40),
    region: required(20),
    postalCode: z.string().trim().regex(/^\d{5}(-\d{4})?$/, "Enter a 5-digit ZIP code."),
    mapsUrl: link,
    gateOpens: time,
    gateCloses: time,
    officeHours: z.array(dayHoursSchema).length(7),
    payUrl: link,
    reserveUrl: link,
    instagramUrl: optionalLink,
    instagramHandle: text(40),
  })
  .refine((c) => c.gateCloses > c.gateOpens, { message: "The gate must close after it opens.", path: ["gateCloses"] });

const titled = (title: number, body: number) => z.object({ title: required(title), body: required(body) });

export const homeSchema = z.object({
  hero: z.object({
    headline: required(80),
    headlineAccent: text(80),
    intro: required(400),
    facts: z.array(z.object({ label: required(30), value: required(40) })).length(3),
    tenantTitle: required(40),
    tenantText: required(160),
    button: buttonSchema,
    secondButton: buttonSchema,
    tenantButton: buttonSchema,
  }),
  why: z.object({
    heading: required(120),
    paragraphs: z.array(required(600)).min(1, "Keep at least one paragraph.").max(4),
    satisfaction: required(160),
  }),
  highlights: z.array(titled(50, 200)).length(4),
  steps: z.object({ heading: required(120), items: z.array(titled(50, 220)).length(3), button: buttonSchema, secondButton: buttonSchema }),
  features: z.object({
    heading: required(120),
    intro: text(400),
    photoTag: text(50),
    items: z
      .array(z.object({ icon: z.enum(iconNames), title: required(50), body: required(300) }))
      .min(1, "Keep at least one feature.")
      .max(9),
  }),
  amenities: z.array(required(50)).max(20),
  /** Off hides the scrolling strip but keeps its phrases. */
  showAmenities: z.boolean(),
  security: z.object({
    heading: required(120),
    text: required(500),
    stats: z.array(z.object({ value: required(12), label: required(80) })).length(3),
    badgeTitle: text(40),
    badgeText: text(80),
  }),
  faq: z.object({
    heading: required(120),
    intro: text(200),
    items: z.array(z.object({ q: required(150), a: required(600) })).max(15),
    button: buttonSchema,
  }),
  contact: z.object({ heading: required(120), formIntro: text(200), button: buttonSchema }),
  cta: z.object({ kicker: text(50), heading: required(120), text: text(240), button: buttonSchema, secondButton: buttonSchema }),
  /** The bar that stays at the bottom of the screen on phones. */
  mobileBar: z.object({ secondButton: buttonSchema, button: buttonSchema }),
});

/** Parts of the homepage a menu link can jump to (section ids), or "link" for any web address. */
export const menuTargets = ["units", "how", "features", "security", "story", "locations", "reviews", "faq", "visit", "top", "link"] as const;
export type MenuTarget = (typeof menuTargets)[number];

export const navbarSchema = z.object({
  /** Empty src: the standard logo mark. */
  logo: z.object({
    src: z
      .string()
      .trim()
      .max(300)
      .refine((v) => v === "" || /^\/media\/[a-z0-9]+-[a-z0-9-]+\.(jpg|png|webp)$/.test(v), "Upload a logo, or use the standard one."),
    alt: text(160),
    credit: text(80),
  }),
  name: required(60),
  /** Empty: "<city>, California". */
  tagline: text(60),
  links: z
    .array(
      z
        .object({ label: required(30), to: z.enum(menuTargets), url: optionalLink })
        .refine((l) => l.to !== "link" || l.url, { message: "Add the web address, or choose a part of the page.", path: ["url"] }),
    )
    .max(8, "Use eight menu links or fewer."),
  secondButton: buttonSchema,
  button: buttonSchema,
});

const photoSchema = z.object({
  src: z
    .string()
    .trim()
    .max(300)
    .refine((v) => /^\/media\/[a-z0-9]+-[a-z0-9-]+\.(jpg|png|webp)$/.test(v) || v.startsWith("https://images.unsplash.com/"), "Upload a photo."),
  alt: required(160),
  credit: text(80),
});

export const photosSchema = z.object({
  hero: photoSchema,
  driveUp: photoSchema,
  door: photoSchema,
  facility: photoSchema,
});

export const aboutSchema = z.object({
  heading: required(120),
  paragraphs: z.array(required(900)).min(1, "Keep at least one paragraph.").max(6),
  timeline: z.array(z.object({ year: z.string().regex(/^\d{4}$/, "Enter a year like 2012."), text: required(300) })).max(12),
});

export const locationsSchema = z.object({
  heading: required(120),
  items: z
    .array(
      z.object({
        name: required(60),
        where: required(80),
        description: text(200),
        buttonLabel: required(40),
        buttonUrl: link,
        highlight: z.boolean(),
      }),
    )
    .min(1, "Keep at least one location.")
    .max(8),
});

export const reviewsSchema = z.object({
  heading: required(120),
  items: z
    .array(
      z.object({
        id,
        quote: required(600),
        name: required(40),
        rating: z.number().int().min(1).max(5),
        enabled: z.boolean(),
      }),
    )
    .max(30),
});

export const settingsSchema = z.object({
  contactEmails: z.array(z.email("Enter a full email address.").max(200)).max(5, "Use five addresses or fewer."),
});

export const sectionSchemas = {
  specials: specialsSchema,
  navbar: navbarSchema,
  units: unitsSchema,
  contact: contactSchema,
  home: homeSchema,
  photos: photosSchema,
  about: aboutSchema,
  locations: locationsSchema,
  reviews: reviewsSchema,
  settings: settingsSchema,
} as const;

export type SectionKey = keyof typeof sectionSchemas;
export const sectionKeys = Object.keys(sectionSchemas) as SectionKey[];
export const isSectionKey = (v: string): v is SectionKey => Object.hasOwn(sectionSchemas, v);
/** Sections only an owner may change. */
export const ownerOnlySections: SectionKey[] = ["settings"];

export const siteContentSchema = z.object({
  version: z.literal(1),
  ...sectionSchemas,
});

export type SiteContent = z.infer<typeof siteContentSchema>;
export type Specials = SiteContent["specials"];
export type Unit = SiteContent["units"]["items"][number];
export type ContactInfo = SiteContent["contact"];
export type Photo = SiteContent["photos"]["hero"];

/** Flattens zod issues to { "items.0.price": "message" } for showing next to form fields. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".");
    if (!(key in out)) out[key] = issue.message;
  }
  return out;
}
