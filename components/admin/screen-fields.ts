// The human side of each admin screen: which fields it shows, their labels and help text, and list behaviour.
// Validation comes from lib/content-schema.ts and what a screen may save from lib/screens.ts.
// To make a new field editable: add it to the schema and defaults, then describe it here.
import { iconNames } from "@/lib/content-schema";
import { screenKeys, screens, type ScreenKey } from "@/lib/screens";

export type Field =
  | {
      kind: "text";
      key: string;
      label: string;
      help?: string;
      multiline?: boolean;
      max: number;
      inputType?: "text" | "email" | "url" | "tel";
      placeholder?: string;
    }
  | { kind: "number"; key: string; label: string; help?: string; prefix?: string; suffix?: string; nullable?: boolean }
  | { kind: "toggle"; key: string; label: string; help?: string }
  | { kind: "date"; key: string; label: string; help?: string }
  | { kind: "time"; key: string; label: string; help?: string }
  | { kind: "select"; key: string; label: string; help?: string; options: { value: string; label: string }[]; numeric?: boolean }
  | { kind: "group"; key?: string; label: string; help?: string; fields: Field[] }
  | {
      kind: "list";
      key: string;
      label: string;
      help?: string;
      itemName: string;
      itemTitle: (item: Record<string, unknown>, index: number) => string;
      fields: Field[];
      newItem?: () => Record<string, unknown>;
      max?: number;
      fixed?: boolean;
      /** Start with every item folded to its title (for long lists). */
      collapse?: boolean;
    }
  | { kind: "strings"; key: string; label: string; help?: string; itemName: string; max: number; maxLength: number; multiline?: boolean; inputType?: "text" | "email" }
  | { kind: "photo"; key: string; label: string; help?: string }
  | { kind: "week"; key: string; label: string; help?: string }
  /** Unit sizes as a table of prices and sold-out switches. */
  | { kind: "unitTable"; key: string; label: string; help?: string }
  /** "Goes to" for a menu link: a part of the homepage, or (with the web address in `urlKey`) any link. */
  | { kind: "target"; key: string; label: string; help?: string; urlKey: string }
  /** A logo upload; empty means the standard logo. */
  | { kind: "logo"; key: string; label: string; help?: string }
  /** A button's words and where it goes. `number`: a call button shows the phone number after the words. */
  | { kind: "button"; key: string; label: string; help?: string; number?: boolean };

/** A card of fields on a screen. `path` is where in the content its fields live. */
export type Block = { path: string[]; title?: string; help?: string; fields: Field[] };

const rid = () => Math.random().toString(36).slice(2, 10);
const link = (key: string, label: string, help?: string): Field => ({
  kind: "text",
  key,
  label,
  help,
  max: 500,
  inputType: "url",
  placeholder: "https://",
});

const iconLabels: Record<(typeof iconNames)[number], string> = {
  tag: "Price tag",
  key: "Key",
  people: "People",
  camera: "Camera",
  truck: "Truck",
  clock: "Clock",
  pin: "Map pin",
  box: "Box",
  shield: "Shield",
  medal: "Medal",
  calendar: "Calendar",
};

const photoHelp = "JPG, PNG or WebP, up to 8 MB.";
const button = (key: string, label: string, opts: { help?: string; number?: boolean } = {}): Field => ({ kind: "button", key, label, ...opts });

export const screenBlocks: Record<ScreenKey, Block[]> = {
  specials: [
    {
      path: ["specials"],
      title: "Show it on the website",
      help: "Dates are optional and in California time; the last day is included. With no dates, the special shows until you switch it off.",
      fields: [
        { kind: "toggle", key: "enabled", label: "Show the special on the website" },
        { kind: "date", key: "startDate", label: "First day (optional)" },
        { kind: "date", key: "endDate", label: "Last day (optional)" },
      ],
    },
    {
      path: ["specials"],
      title: "What the bar says",
      fields: [
        { kind: "text", key: "headline", label: "Headline", max: 90, help: "Short and bold, for example: First month for $1." },
        { kind: "text", key: "text", label: "Details", max: 220, multiline: true, help: "One sentence, shown next to the headline." },
      ],
    },
    {
      path: ["specials"],
      title: "Button (optional)",
      help: "A small link at the end of the bar. Leave the label empty for no button. There's one special at a time: changing it replaces the current one.",
      fields: [
        { kind: "text", key: "buttonLabel", label: "Button label", max: 40, help: "For example: Reserve now." },
        link("buttonUrl", "Button link (optional)", "Leave empty to send people to your “Reserve a unit” page."),
      ],
    },
  ],

  navbar: [
    {
      path: ["navbar"],
      title: "Logo and name",
      help: "Shown at the top left of every page and in the footer.",
      fields: [
        { kind: "logo", key: "logo", label: "Logo", help: "A PNG with a see-through background works best. It's shown about as tall as a line of big text." },
        { kind: "text", key: "name", label: "Business name", max: 60 },
        { kind: "text", key: "tagline", label: "Small line under the name (optional)", max: 60, help: "Leave it empty to show your city, for example “Tulare, California”." },
      ],
    },
    {
      path: ["navbar"],
      title: "Menu links",
      help: "Shown in this order in the menu bar, the phone menu and the footer. On a computer about six fit on one line.",
      fields: [
        {
          kind: "list",
          key: "links",
          label: "Links",
          itemName: "menu link",
          max: 8,
          itemTitle: (l, i) => String(l.label || `Link ${i + 1}`),
          newItem: () => ({ label: "", to: "units", url: "" }),
          fields: [
            { kind: "text", key: "label", label: "Words in the menu", max: 30 },
            { kind: "target", key: "to", label: "Goes to", urlKey: "url" },
          ],
        },
      ],
    },
    {
      path: ["navbar"],
      title: "Buttons",
      help: "At the top right, next to the menu. On phones only the right button shows; the phone menu has a “Pay your bill” link.",
      fields: [button("secondButton", "Left button (outlined)"), button("button", "Right button (blue)")],
    },
    {
      path: ["contact"],
      title: "Pay and Reserve links",
      help: "Every button set to “Your Pay page” or “Your Reserve page” goes to these, all over the site (the same links as on Hours, phone, address & links).",
      fields: [
        link("payUrl", "Pay / customer login link", "Your Storedge customer login page."),
        link("reserveUrl", "Reserve link", "Your Quikstor reservation page."),
      ],
    },
  ],

  hero: [
    {
      path: ["home", "hero"],
      title: "Headline and introduction",
      help: "The small rotating line above the headline shows the titles of the four reasons from “Why choose us”.",
      fields: [
        { kind: "text", key: "headline", label: "Headline, first part (white)", max: 80, help: "For example: Drive up, unload and" },
        {
          kind: "text",
          key: "headlineAccent",
          label: "Headline, second part (light blue, optional)",
          max: 80,
          help: "Continues the headline in light blue. Leave it empty for an all-white headline.",
        },
        { kind: "text", key: "intro", label: "Introduction", max: 400, multiline: true, help: "The paragraph under the headline." },
      ],
    },
    {
      path: ["home", "hero"],
      title: "Buttons under the introduction",
      fields: [button("button", "First button (blue)"), button("secondButton", "Second button (see-through)")],
    },
    {
      path: ["photos"],
      title: "Big photo",
      fields: [{ kind: "photo", key: "hero", label: "Photo behind the headline", help: `A wide photo works best. ${photoHelp}` }],
    },
    {
      path: ["home", "hero"],
      title: "Quick facts",
      help: "The white bar under the photo. The first fact, gate hours, comes from Hours, phone, address & links automatically.",
      fields: [
        {
          kind: "list",
          key: "facts",
          label: "Facts",
          itemName: "fact",
          fixed: true,
          itemTitle: (f, i) => String(f.label || `Fact ${i + 2}`),
          fields: [
            { kind: "text", key: "label", label: "Small label", max: 30 },
            { kind: "text", key: "value", label: "Fact", max: 40 },
          ],
        },
      ],
    },
    {
      path: ["home", "hero"],
      title: "“Already a tenant?” box (customer login)",
      help: "The see-through box next to the headline. Its button always goes to your Pay link.",
      fields: [
        { kind: "text", key: "tenantTitle", label: "Heading", max: 40 },
        { kind: "text", key: "tenantText", label: "Text", max: 160 },
        button("tenantButton", "Button in the box"),
      ],
    },
  ],

  why: [
    {
      path: ["home", "why"],
      title: "Welcome text",
      fields: [
        { kind: "text", key: "heading", label: "Heading", max: 120 },
        { kind: "strings", key: "paragraphs", label: "Paragraphs", itemName: "paragraph", max: 4, maxLength: 600, multiline: true },
        { kind: "text", key: "satisfaction", label: "Sentence beside the big “110%”", max: 160, help: "The number itself is fixed." },
      ],
    },
    {
      path: ["home"],
      title: "The four cards beside it (reasons to choose you)",
      help: "Shown as four cards. Their titles also rotate in the small badge at the top of the page.",
      fields: [
        {
          kind: "list",
          key: "highlights",
          label: "Reasons",
          itemName: "reason",
          fixed: true,
          itemTitle: (h, i) => String(h.title || `Reason ${i + 1}`),
          fields: [
            { kind: "text", key: "title", label: "Title", max: 50 },
            { kind: "text", key: "body", label: "Text", max: 200, multiline: true },
          ],
        },
      ],
    },
  ],

  units: [
    {
      path: ["units"],
      title: "Prices and sold out",
      fields: [
        {
          kind: "unitTable",
          key: "items",
          label: "Monthly prices and sold out",
          help: "Whole dollars. Leave a price empty to show “Call for price”. A sold-out size is shown dimmed with a “Join the waitlist (call)” button.",
        },
      ],
    },
    {
      path: ["units"],
      title: "Buttons under the floor plan",
      help: "The picker shows one of these, depending on whether the chosen size is sold out.",
      fields: [button("button", "Button for a size you can rent"), button("soldOutButton", "Button for a sold-out size")],
    },
    {
      path: ["units"],
      title: "Sizes in detail",
      help: "Width, depth, name and what fits. Click a size to change it, or add a new one.",
      fields: [
        {
          kind: "list",
          key: "items",
          label: "Sizes",
          help: "Shown in this order on the website.",
          itemName: "size",
          max: 20,
          collapse: true,
          itemTitle: (u, i) =>
            u.width && u.depth
              ? [`${u.width}×${u.depth} ${u.name || ""}`.trim(), u.soldOut ? "Sold out" : typeof u.price === "number" ? `$${u.price}/mo` : "Call for price"].join(" · ")
              : `Size ${i + 1}`,
          newItem: () => ({ id: rid(), width: 10, depth: 10, name: "", description: "", price: null, soldOut: false }),
          fields: [
            { kind: "number", key: "width", label: "Width", suffix: "feet" },
            { kind: "number", key: "depth", label: "Depth", suffix: "feet" },
            { kind: "text", key: "name", label: "Name", max: 40, help: "For example: Medium." },
            { kind: "text", key: "description", label: "What fits", max: 160, help: "For example: The contents of a one-bedroom apartment." },
            {
              kind: "number",
              key: "price",
              label: "Monthly price",
              prefix: "$",
              suffix: "per month",
              nullable: true,
              help: "Whole dollars. Leave empty to show “Call for price”.",
            },
            { kind: "toggle", key: "soldOut", label: "Sold out" },
          ],
        },
      ],
    },
    {
      path: ["units"],
      title: "Section text",
      fields: [
        { kind: "text", key: "heading", label: "Heading", max: 120 },
        { kind: "text", key: "intro", label: "Introduction", max: 400, multiline: true },
        {
          kind: "text",
          key: "note",
          label: "Note under the size picker",
          max: 200,
          help: "If it mentions your phone number, check it still matches after changing the number. It becomes a call link automatically.",
        },
      ],
    },
  ],

  steps: [
    {
      path: ["home", "steps"],
      fields: [
        { kind: "text", key: "heading", label: "Heading", max: 120 },
        {
          kind: "list",
          key: "items",
          label: "The three steps",
          itemName: "step",
          fixed: true,
          itemTitle: (s, i) => `Step ${i + 1}: ${s.title || ""}`,
          fields: [
            { kind: "text", key: "title", label: "Title", max: 50 },
            { kind: "text", key: "body", label: "Text", max: 220, multiline: true },
          ],
        },
      ],
    },
    {
      path: ["home", "steps"],
      title: "Buttons under the steps",
      fields: [button("button", "First button (blue)", { number: true }), button("secondButton", "Second button (outlined)", { number: true })],
    },
  ],

  features: [
    {
      path: ["home", "features"],
      title: "Section text",
      fields: [
        { kind: "text", key: "heading", label: "Heading", max: 120 },
        { kind: "text", key: "intro", label: "Introduction", max: 400, multiline: true },
      ],
    },
    {
      path: ["home", "features"],
      fields: [
        {
          kind: "list",
          key: "items",
          label: "Feature cards",
          collapse: true,
          itemName: "feature",
          max: 9,
          itemTitle: (f, i) => String(f.title || `Feature ${i + 1}`),
          newItem: () => ({ icon: "box", title: "", body: "" }),
          fields: [
            { kind: "text", key: "title", label: "Title", max: 50 },
            { kind: "select", key: "icon", label: "Icon", options: iconNames.map((v) => ({ value: v, label: iconLabels[v] })) },
            { kind: "text", key: "body", label: "Text", max: 300, multiline: true },
          ],
        },
      ],
    },
    {
      path: ["photos"],
      title: "Photo",
      fields: [{ kind: "photo", key: "driveUp", label: "Photo next to the features", help: `A tall or square photo works best. ${photoHelp}` }],
    },
    {
      path: ["home", "features"],
      title: "Label on the photo",
      fields: [{ kind: "text", key: "photoTag", label: "Label", max: 50, help: "The small white label on the photo. Leave empty to hide it." }],
    },
  ],

  strip: [
    {
      path: ["home"],
      fields: [
        { kind: "toggle", key: "showAmenities", label: "Show the scrolling strip on the website", help: "Switching it off keeps the phrases for later." },
        {
          kind: "strings",
          key: "amenities",
          label: "Phrases",
          help: "Short phrases that scroll across the blue strip, between Facility features and Security.",
          itemName: "phrase",
          max: 20,
          maxLength: 50,
        },
      ],
    },
  ],

  security: [
    {
      path: ["home", "security"],
      title: "Text",
      fields: [
        { kind: "text", key: "heading", label: "Heading", max: 120 },
        { kind: "text", key: "text", label: "Paragraph", max: 500, multiline: true },
      ],
    },
    {
      path: ["home", "security"],
      fields: [
        {
          kind: "list",
          key: "stats",
          label: "Three big numbers",
          itemName: "number",
          fixed: true,
          itemTitle: (s, i) => String(s.value || `Number ${i + 1}`),
          fields: [
            { kind: "text", key: "value", label: "Big number", max: 12, help: "For example: 24/7" },
            { kind: "text", key: "label", label: "Text under it", max: 80 },
          ],
        },
      ],
    },
    {
      path: ["photos"],
      title: "Photo",
      fields: [{ kind: "photo", key: "door", label: "Photo in the security section", help: `A tall photo works best. ${photoHelp}` }],
    },
    {
      path: ["home", "security"],
      title: "Label on the photo",
      fields: [
        { kind: "text", key: "badgeTitle", label: "First line (bold)", max: 40, help: "Leave empty to hide the label." },
        { kind: "text", key: "badgeText", label: "Second line", max: 80 },
      ],
    },
  ],

  story: [
    {
      path: ["about"],
      title: "Story",
      fields: [
        { kind: "text", key: "heading", label: "Heading", max: 120 },
        { kind: "strings", key: "paragraphs", label: "Paragraphs", itemName: "paragraph", max: 6, maxLength: 900, multiline: true },
      ],
    },
    {
      path: ["about"],
      fields: [
        {
          kind: "list",
          key: "timeline",
          collapse: true,
          label: "Timeline",
          help: "Shown in this order. Remove every year to hide the timeline.",
          itemName: "year",
          max: 12,
          itemTitle: (t, i) => String(t.year || `Entry ${i + 1}`),
          newItem: () => ({ year: String(new Date().getFullYear()), text: "" }),
          fields: [
            { kind: "text", key: "year", label: "Year", max: 4 },
            { kind: "text", key: "text", label: "What happened", max: 300, multiline: true },
          ],
        },
      ],
    },
  ],

  locations: [
    {
      path: ["locations"],
      fields: [
        { kind: "text", key: "heading", label: "Heading", max: 120 },
        {
          kind: "list",
          key: "items",
          label: "Location cards",
          collapse: true,
          itemName: "location",
          max: 8,
          itemTitle: (l, i) => String(l.name || `Location ${i + 1}`),
          newItem: () => ({ name: "", where: "", description: "", buttonLabel: "Log in or reserve", buttonUrl: "", highlight: false }),
          fields: [
            { kind: "text", key: "name", label: "Name", max: 60 },
            { kind: "text", key: "where", label: "Address line", max: 80 },
            { kind: "text", key: "description", label: "Description", max: 200 },
            { kind: "text", key: "buttonLabel", label: "Button label", max: 40 },
            link("buttonUrl", "Button link"),
            { kind: "toggle", key: "highlight", label: "This card is this facility", help: "Shows the card in dark blue with “You are here”. Switch it on for one card only." },
          ],
        },
      ],
    },
  ],

  reviews: [
    {
      path: ["reviews"],
      fields: [
        { kind: "text", key: "heading", label: "Heading", max: 120 },
        {
          kind: "list",
          key: "items",
          label: "Reviews",
          collapse: true,
          help: "Only add real reviews from real customers, with their permission.",
          itemName: "review",
          max: 30,
          itemTitle: (r, i) => (r.name ? `${r.name} (${r.rating}★)` : `Review ${i + 1}`),
          newItem: () => ({ id: rid(), quote: "", name: "", rating: 5, enabled: true }),
          fields: [
            { kind: "text", key: "quote", label: "What they said", max: 600, multiline: true },
            { kind: "text", key: "name", label: "Name", max: 40, help: "First name and last initial, for example: Maria G." },
            {
              kind: "select",
              key: "rating",
              label: "Stars",
              numeric: true,
              options: [5, 4, 3, 2, 1].map((n) => ({ value: String(n), label: `${n} star${n === 1 ? "" : "s"}` })),
            },
            { kind: "toggle", key: "enabled", label: "Show on the website" },
          ],
        },
      ],
    },
  ],

  faq: [
    {
      path: ["home", "faq"],
      fields: [
        { kind: "text", key: "heading", label: "Heading", max: 120 },
        { kind: "text", key: "intro", label: "Text under the heading", max: 200 },
        button("button", "Button under that text", { number: true }),
        {
          kind: "list",
          key: "items",
          label: "Questions",
          collapse: true,
          help: "The first question is shown open. Remove them all to hide this section.",
          itemName: "question",
          max: 15,
          itemTitle: (f, i) => String(f.q || `Question ${i + 1}`),
          newItem: () => ({ q: "", a: "" }),
          fields: [
            { kind: "text", key: "q", label: "Question", max: 150 },
            { kind: "text", key: "a", label: "Answer", max: 600, multiline: true },
          ],
        },
      ],
    },
  ],

  cta: [
    {
      path: ["home", "cta"],
      title: "Text",
      fields: [
        { kind: "text", key: "kicker", label: "Small line above the heading", max: 50 },
        { kind: "text", key: "heading", label: "Heading", max: 120 },
        { kind: "text", key: "text", label: "Text", max: 240 },
      ],
    },
    {
      path: ["home", "cta"],
      title: "Buttons",
      fields: [button("button", "First button (white)", { number: true }), button("secondButton", "Second button (see-through)", { number: true })],
    },
    {
      path: ["photos"],
      title: "Background photo",
      fields: [{ kind: "photo", key: "facility", label: "Photo behind the banner", help: `Shown darkened. ${photoHelp}` }],
    },
  ],

  contact: [
    {
      path: ["contact"],
      title: "Gate hours",
      help: "The gate is open every day between these times. They're filled in automatically at the top of the page, in the quick facts, the Contact section and the footer. Text you typed yourself is listed at the bottom of this page, so you can check it still matches.",
      fields: [
        { kind: "time", key: "gateOpens", label: "Gate opens" },
        { kind: "time", key: "gateCloses", label: "Gate closes" },
      ],
    },
    {
      path: ["contact"],
      fields: [
        {
          kind: "week",
          key: "officeHours",
          label: "Office hours",
          help: "Switch on the days the office is open. If every day is switched off, office hours aren't shown on the website.",
        },
      ],
    },
    {
      path: ["contact"],
      title: "Phone and address",
      help: "Shown at the top of the page, in the Contact section and in the footer.",
      fields: [
        { kind: "text", key: "phone", label: "Phone number", max: 30, inputType: "tel", help: "Type it exactly as visitors should see it, for example (559) 688-4787." },
        { kind: "text", key: "street", label: "Street address", max: 80 },
        { kind: "text", key: "city", label: "City", max: 40, help: "Also shown under your logo." },
        { kind: "text", key: "region", label: "State", max: 20 },
        { kind: "text", key: "postalCode", label: "ZIP code", max: 10 },
        link("mapsUrl", "Google Maps link", "Open your business in Google Maps, choose Share, and paste the link here."),
      ],
    },
    {
      path: ["contact"],
      title: "Links on the buttons",
      help: "Every “Pay your bill”, “Customer login & pay” and “Reserve a unit” button on the site goes to these links.",
      fields: [
        link("payUrl", "“Pay your bill” link", "Your Storedge customer login page. Used by “Pay bill” at the top, “Customer login & pay”, the footer and the phone menu."),
        link("reserveUrl", "“Reserve a unit” link", "Your Quikstor reservation page. Used by every Reserve button: top of the page, the size picker, How it works, the bottom banner, the footer and the phone's call bar."),
        link("sisterLoginUrl", "Visalia locations login link (optional)"),
        link("instagramUrl", "Instagram page (optional)"),
        { kind: "text", key: "instagramHandle", label: "Instagram name", max: 40, help: "For example: @rapidselfstorage" },
      ],
    },
    {
      path: ["home", "contact"],
      title: "Contact section",
      fields: [
        { kind: "text", key: "heading", label: "Heading", max: 120 },
        { kind: "text", key: "formIntro", label: "Line under “Send a message”", max: 200 },
        button("button", "Button under the address", { number: true }),
      ],
    },
    {
      path: ["home", "mobileBar"],
      title: "Bar at the bottom of phones",
      help: "On phones, this bar slides up once visitors scroll past the top of the page.",
      fields: [button("secondButton", "Left button (outlined)"), button("button", "Right button (blue)")],
    },
  ],

  photos: [
    {
      path: ["photos"],
      fields: [
        { kind: "photo", key: "hero", label: "Top of the page", help: `Behind the headline. A wide photo works best. ${photoHelp}` },
        { kind: "photo", key: "driveUp", label: "Facility features", help: `Next to the feature cards. Tall or square works best. ${photoHelp}` },
        { kind: "photo", key: "door", label: "Security", help: `In the dark blue security section. ${photoHelp}` },
        { kind: "photo", key: "facility", label: "Bottom banner", help: `Shown darkened behind the “Reserve” banner. ${photoHelp}` },
      ],
    },
  ],

  settings: [
    {
      path: ["settings"],
      fields: [
        {
          kind: "strings",
          key: "contactEmails",
          label: "Send contact form messages to",
          help: "Up to five email addresses. If this is empty, messages go to the address your developer set up.",
          itemName: "email address",
          max: 5,
          maxLength: 200,
          inputType: "email",
        },
      ],
    },
  ],
};

// A field outside its screen's scopes (lib/screens.ts) would show up but never be saved. Say so while developing.
if (process.env.NODE_ENV !== "production") {
  for (const key of screenKeys) {
    for (const block of screenBlocks[key]) {
      for (const f of block.fields) {
        const path = f.kind === "group" && !f.key ? block.path : [...block.path, f.key ?? ""];
        if (!screens[key].scopes.some((scope) => scope.every((k, i) => path[i] === k))) {
          console.error(`screen-fields: the "${key}" screen shows ${path.join(".")}, which isn't in its scopes in lib/screens.ts, so it would never be saved.`);
        }
      }
    }
  }
}

/**
 * Where a content path is edited, in the owner's words: "Questions & answers (FAQ) › Questions › Question 3 › Answer",
 * with a link to the screen (and to the field when it's always on screen). Null if no screen shows it.
 */
export function describePath(path: (string | number)[]): { screen: ScreenKey; label: string; href: string } | null {
  for (const screen of screenKeys) {
    for (const block of screenBlocks[screen]) {
      if (!block.path.every((k, i) => path[i] === k)) continue;
      const labels = [screens[screen].title];
      let rest = path.slice(block.path.length);
      let fields = block.fields;
      let anchor: (string | number)[] = [...block.path];
      let found = false;
      while (rest.length) {
        const field = fields.find((f) => f.kind !== "group" && f.kind !== "unitTable" && f.key === rest[0]);
        if (!field || field.kind === "group" || field.kind === "unitTable") break;
        found = true;
        labels.push(field.label);
        anchor = [...anchor, field.key];
        if (field.kind === "list" && typeof rest[1] === "number") {
          labels.push(`${field.itemName[0].toUpperCase()}${field.itemName.slice(1)} ${rest[1] + 1}`);
          anchor = [...anchor, rest[1]];
          fields = field.fields;
          rest = rest.slice(2);
          continue;
        }
        if (field.kind === "strings" && typeof rest[1] === "number") {
          labels.push(`${field.itemName} ${rest[1] + 1}`);
          anchor = [...anchor, rest[1]];
        }
        break;
      }
      if (found) return { screen, label: labels.join(" › "), href: `/admin/${screen}#f-${anchor.join("-")}` };
    }
  }
  return null;
}

/** "Top of the page: Headline, Introduction" style summary of a list of changed paths. */
export function describeChanges(paths: (string | number)[][], max = 4): string {
  const byScreen = new Map<string, string[]>();
  for (const p of paths) {
    const d = describePath(p);
    if (!d) continue;
    const [title, ...rest] = d.label.split(" › ");
    const what = rest.length ? rest[rest.length - 1] : title;
    const list = byScreen.get(title) ?? [];
    if (!list.includes(what)) list.push(what);
    byScreen.set(title, list);
  }
  const parts = [...byScreen].map(([title, what]) => {
    const shown = what.slice(0, max).join(", ");
    return `${title}: ${shown}${what.length > max ? ` and ${what.length - max} more` : ""}`;
  });
  return parts.join("; ");
}
