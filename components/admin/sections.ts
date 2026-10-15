// What each admin screen edits and how its fields are labelled. Validation comes from lib/content-schema.ts;
// this file only adds the human side: labels, help text, list behaviour. To make a new field editable, add it
// to the schema and defaults first, then describe it here.
import { iconNames, type SectionKey } from "@/lib/content-schema";

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
    }
  | { kind: "strings"; key: string; label: string; help?: string; itemName: string; max: number; maxLength: number; multiline?: boolean; inputType?: "text" | "email" }
  | { kind: "photo"; key: string; label: string; help?: string }
  | { kind: "week"; key: string; label: string; help?: string };

export type SectionConfig = { title: string; intro: string; fields: Field[] };

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

export const sectionConfigs: Record<SectionKey, SectionConfig> = {
  specials: {
    title: "Specials",
    intro: "Show a short offer in a bar at the very top of the website, such as a move-in deal.",
    fields: [
      { kind: "toggle", key: "enabled", label: "Show the special on the website" },
      { kind: "text", key: "headline", label: "Headline", max: 90, help: "Short and bold, for example: First month for $1." },
      { kind: "text", key: "text", label: "Details", max: 220, multiline: true, help: "One sentence, shown next to the headline." },
      { kind: "text", key: "buttonLabel", label: "Button label (optional)", max: 40, help: "For example: Reserve now. Leave empty for no button." },
      link("buttonUrl", "Button link", "Where the button goes. Copy the full address from your browser."),
      {
        kind: "group",
        label: "When to show it (optional)",
        help: "Dates are in California time. Leave both empty to show the special until you switch it off.",
        fields: [
          { kind: "date", key: "startDate", label: "First day" },
          { kind: "date", key: "endDate", label: "Last day" },
        ],
      },
    ],
  },

  units: {
    title: "Unit sizes & prices",
    intro: "The sizes in the floor-plan picker, their monthly prices, and which ones are sold out.",
    fields: [
      {
        kind: "list",
        key: "items",
        label: "Sizes",
        help: "Shown in this order on the website.",
        itemName: "size",
        max: 20,
        itemTitle: (u, i) => (u.width && u.depth ? `${u.width}×${u.depth} ${u.name || ""}`.trim() : `Size ${i + 1}`),
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
          {
            kind: "toggle",
            key: "soldOut",
            label: "Sold out",
            help: "Shows the size dimmed, with a “Join the waitlist (call)” button instead of Reserve.",
          },
        ],
      },
      {
        kind: "group",
        label: "Section text",
        fields: [
          { kind: "text", key: "heading", label: "Heading", max: 120 },
          { kind: "text", key: "intro", label: "Introduction", max: 400, multiline: true },
          { kind: "text", key: "note", label: "Note under the picker", max: 200, help: "The phone number becomes a call link automatically." },
        ],
      },
    ],
  },

  contact: {
    title: "Hours & contact",
    intro: "Gate and office hours, phone, address, and the links for paying and reserving.",
    fields: [
      {
        kind: "group",
        label: "Gate hours",
        help: "The gate is open every day between these times. The “Convenient access” feature and one FAQ answer also mention the hours; update them under Homepage text if the hours change.",
        fields: [
          { kind: "time", key: "gateOpens", label: "Gate opens" },
          { kind: "time", key: "gateCloses", label: "Gate closes" },
        ],
      },
      {
        kind: "week",
        key: "officeHours",
        label: "Office hours",
        help: "Tick the days the office is open. If no day is ticked, office hours aren't shown on the website.",
      },
      {
        kind: "group",
        label: "Phone and address",
        fields: [
          { kind: "text", key: "phone", label: "Phone number", max: 30, inputType: "tel", help: "Shown as you type it, for example (559) 688-4787." },
          { kind: "text", key: "street", label: "Street address", max: 80 },
          { kind: "text", key: "city", label: "City", max: 40 },
          { kind: "text", key: "region", label: "State", max: 20 },
          { kind: "text", key: "postalCode", label: "ZIP code", max: 10 },
          link("mapsUrl", "Google Maps link", "Open your business in Google Maps, choose Share, and paste the link here."),
        ],
      },
      {
        kind: "group",
        label: "Links",
        fields: [
          link("payUrl", "“Pay your bill” link", "Your Storedge customer login page."),
          link("reserveUrl", "“Reserve a unit” link", "Your Quikstor reservation page."),
          link("sisterLoginUrl", "Visalia locations login link (optional)"),
          link("instagramUrl", "Instagram page (optional)"),
          { kind: "text", key: "instagramHandle", label: "Instagram name", max: 40, help: "For example: @rapidselfstorage" },
        ],
      },
    ],
  },

  home: {
    title: "Homepage text",
    intro: "The words on the home page, from the top of the page to the banner at the bottom.",
    fields: [
      {
        kind: "group",
        key: "hero",
        label: "Top of the page",
        fields: [
          { kind: "text", key: "headline", label: "Headline (white part)", max: 80 },
          { kind: "text", key: "headlineAccent", label: "Headline (blue part)", max: 80 },
          { kind: "text", key: "intro", label: "Introduction", max: 400, multiline: true },
          {
            kind: "list",
            key: "facts",
            label: "Quick facts",
            help: "Shown in the white bar under the photo. The first fact, gate hours, is filled in automatically from Hours & contact.",
            itemName: "fact",
            fixed: true,
            itemTitle: (f, i) => String(f.label || `Fact ${i + 1}`),
            fields: [
              { kind: "text", key: "label", label: "Label", max: 30 },
              { kind: "text", key: "value", label: "Value", max: 40 },
            ],
          },
          { kind: "text", key: "tenantTitle", label: "Tenant box heading", max: 40 },
          { kind: "text", key: "tenantText", label: "Tenant box text", max: 160 },
        ],
      },
      {
        kind: "group",
        key: "why",
        label: "Why Rapid Self Storage",
        fields: [
          { kind: "text", key: "heading", label: "Heading", max: 120 },
          { kind: "strings", key: "paragraphs", label: "Paragraphs", itemName: "paragraph", max: 4, maxLength: 600, multiline: true },
          { kind: "text", key: "satisfaction", label: "Text next to “110%”", max: 160 },
        ],
      },
      {
        kind: "list",
        key: "highlights",
        label: "Four reasons to choose you",
        help: "Shown as cards. The four titles also rotate at the top of the page.",
        itemName: "reason",
        fixed: true,
        itemTitle: (h, i) => String(h.title || `Reason ${i + 1}`),
        fields: [
          { kind: "text", key: "title", label: "Title", max: 50 },
          { kind: "text", key: "body", label: "Text", max: 200, multiline: true },
        ],
      },
      {
        kind: "group",
        key: "steps",
        label: "How it works",
        fields: [
          { kind: "text", key: "heading", label: "Heading", max: 120 },
          {
            kind: "list",
            key: "items",
            label: "Steps",
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
        kind: "group",
        key: "features",
        label: "Facility features",
        fields: [
          { kind: "text", key: "heading", label: "Heading", max: 120 },
          { kind: "text", key: "intro", label: "Introduction", max: 400, multiline: true },
          { kind: "text", key: "photoTag", label: "Label on the photo", max: 50 },
          {
            kind: "list",
            key: "items",
            label: "Features",
            itemName: "feature",
            max: 9,
            itemTitle: (f, i) => String(f.title || `Feature ${i + 1}`),
            newItem: () => ({ icon: "box", title: "", body: "" }),
            fields: [
              { kind: "select", key: "icon", label: "Icon", options: iconNames.map((v) => ({ value: v, label: iconLabels[v] })) },
              { kind: "text", key: "title", label: "Title", max: 50 },
              { kind: "text", key: "body", label: "Text", max: 300, multiline: true },
            ],
          },
        ],
      },
      {
        kind: "strings",
        key: "amenities",
        label: "Scrolling strip",
        help: "Short phrases that scroll across the blue strip. Leave the list empty to hide the strip.",
        itemName: "phrase",
        max: 20,
        maxLength: 50,
      },
      {
        kind: "group",
        key: "security",
        label: "Security",
        fields: [
          { kind: "text", key: "heading", label: "Heading", max: 120 },
          { kind: "text", key: "text", label: "Text", max: 500, multiline: true },
          {
            kind: "list",
            key: "stats",
            label: "Three numbers",
            itemName: "number",
            fixed: true,
            itemTitle: (s, i) => String(s.value || `Number ${i + 1}`),
            fields: [
              { kind: "text", key: "value", label: "Big number", max: 12, help: "For example: 24/7" },
              { kind: "text", key: "label", label: "Text under it", max: 80 },
            ],
          },
          { kind: "text", key: "badgeTitle", label: "Label on the photo (bold)", max: 40, help: "Leave empty to hide the label." },
          { kind: "text", key: "badgeText", label: "Label on the photo (second line)", max: 80 },
        ],
      },
      {
        kind: "group",
        key: "faq",
        label: "Questions and answers",
        fields: [
          { kind: "text", key: "heading", label: "Heading", max: 120 },
          { kind: "text", key: "intro", label: "Introduction", max: 200 },
          {
            kind: "list",
            key: "items",
            label: "Questions",
            help: "The first question is shown open. Leave the list empty to hide this section.",
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
      {
        kind: "group",
        key: "contact",
        label: "Contact section",
        fields: [
          { kind: "text", key: "heading", label: "Heading", max: 120 },
          { kind: "text", key: "formIntro", label: "Text above the form", max: 200 },
        ],
      },
      {
        kind: "group",
        key: "cta",
        label: "Banner at the bottom",
        fields: [
          { kind: "text", key: "kicker", label: "Small line above the heading", max: 50 },
          { kind: "text", key: "heading", label: "Heading", max: 120 },
          { kind: "text", key: "text", label: "Text", max: 240 },
        ],
      },
    ],
  },

  photos: {
    title: "Photos",
    intro: "The four large photos on the home page. Upload a JPG, PNG or WebP photo up to 8 MB.",
    fields: [
      { kind: "photo", key: "hero", label: "Top of the page", help: "A wide photo works best. It sits behind the headline." },
      { kind: "photo", key: "driveUp", label: "Facility features", help: "A tall or square photo, shown next to the features." },
      { kind: "photo", key: "door", label: "Security", help: "Shown in the dark Security section." },
      { kind: "photo", key: "facility", label: "Banner at the bottom", help: "Shown darkened behind the “Reserve” banner." },
    ],
  },

  about: {
    title: "About & history",
    intro: "Your company story and the timeline next to it.",
    fields: [
      { kind: "text", key: "heading", label: "Heading", max: 120 },
      { kind: "strings", key: "paragraphs", label: "Story", itemName: "paragraph", max: 6, maxLength: 900, multiline: true },
      {
        kind: "list",
        key: "timeline",
        label: "Timeline",
        help: "Shown in this order. Leave empty to hide the timeline.",
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

  locations: {
    title: "Locations",
    intro: "This facility and your sister locations, shown as cards.",
    fields: [
      { kind: "text", key: "heading", label: "Heading", max: 120 },
      {
        kind: "list",
        key: "items",
        label: "Locations",
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
          { kind: "toggle", key: "highlight", label: "This is the Tulare facility", help: "Shows the card in dark blue with “You are here”." },
        ],
      },
    ],
  },

  reviews: {
    title: "Reviews",
    intro:
      "Quotes from real customers. Only add real reviews, with the customer's permission. The section appears on the website once at least one review is switched on.",
    fields: [
      { kind: "text", key: "heading", label: "Heading", max: 120 },
      {
        kind: "list",
        key: "items",
        label: "Reviews",
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

  settings: {
    title: "Settings",
    intro: "Where messages from the website's contact form are sent.",
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
};
