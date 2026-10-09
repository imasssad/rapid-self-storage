// All business content lives here so it can be edited without touching the layout.

export const site = {
  name: "Rapid Self Storage",
  url: "https://rapidselfstorage.com",
  description:
    "Drive-up self storage in Tulare, CA. Month-to-month rentals, no deposit, individual gate codes and staff on site six days a week.",
  phoneDisplay: "(559) 688-4787",
  phoneHref: "tel:+15596884787",
  address: {
    street: "1682 N J St",
    city: "Tulare",
    region: "CA",
    postalCode: "93274",
  },
  mapsUrl: "https://goo.gl/maps/LrHat5624ZYiJjnb6",
  instagram: {
    handle: "@rapidselfstorage",
    url: "https://www.instagram.com/rapidselfstorage",
  },
  gateHours: "6 AM to 8 PM, every day",
  payUrl:
    "https://rental-center.storedge.com/?companyId=ee6dd943-e3a5-49c9-af42-8bc54fe490cc&facilityId=f09f5cd3-ddb3-448e-89a4-961373ade47f#/login",
  reserveUrl: "https://ecom.quikstor.com/rapid_self_storage/Account/Login",
  sisterLoginUrl: "https://ecom.quikstor.com/midvalleystorage/Account/Login",
} as const;

export const nav = [
  { href: "#units", label: "Unit sizes" },
  { href: "#features", label: "Features" },
  { href: "#security", label: "Security" },
  { href: "#story", label: "About" },
  { href: "#locations", label: "Locations" },
  { href: "#visit", label: "Contact" },
];

// Placeholder photos (free, Unsplash License). Replace with Eric's own facility photos in /public.
export const photos = {
  hero: {
    src: "https://images.unsplash.com/photo-1649313522492-ffb2ab3c7dac",
    alt: "A row of drive-up storage units with roll-up doors",
    credit: "Adam Winger on Unsplash",
  },
  driveUp: {
    src: "https://images.unsplash.com/photo-1696976004001-e714f32f2fa5",
    alt: "A car parked in front of a row of storage units",
    credit: "Moj Box on Unsplash",
  },
  door: {
    src: "https://images.unsplash.com/photo-1790707844410-edabebd75fb7",
    alt: "A white roll-up storage unit door",
    credit: "Adam Winger on Unsplash",
  },
  facility: {
    src: "https://images.unsplash.com/photo-1649313444539-a8900c5cdc54",
    alt: "Rows of single-story storage units under a clear sky",
    credit: "Adam Winger on Unsplash",
  },
} as const;

export const specs = [
  { label: "Gate hours", value: site.gateHours },
  { label: "Terms", value: "Month to month, no deposit" },
  { label: "Unit sizes", value: "5×5 up to 20×20" },
  { label: "In the office", value: "Staff six days a week" },
];

// TODO(confirm with Eric): the old site only states "5×5 to 20×20".
// The in-between sizes are typical industry sizes, not confirmed inventory.
export const units = [
  { w: 5, d: 5, name: "Small", use: "Holiday decorations, boxes and files." },
  { w: 5, d: 10, name: "Small plus", use: "Boxes and small furniture from a bedroom." },
  { w: 10, d: 10, name: "Medium", use: "The contents of a one-bedroom apartment." },
  { w: 10, d: 15, name: "Medium plus", use: "A two-bedroom home's furniture and boxes." },
  { w: 10, d: 20, name: "Large", use: "A larger home with appliances." },
  { w: 20, d: 20, name: "Oversized", use: "A whole house, or business inventory and equipment." },
];

export type IconName = "tag" | "key" | "people" | "camera" | "truck" | "clock" | "pin" | "box";

export const highlights: { icon: IconName; title: string; body: string }[] = [
  { icon: "tag", title: "Upfront, flat rate", body: "Month to month with no deposit and no long-term contract." },
  { icon: "key", title: "Your own gate code", body: "The keypad knows your name and unit, and every entry is logged." },
  { icon: "people", title: "Staff on site", body: "Friendly managers in the office six days a week." },
  { icon: "camera", title: "Watched around the clock", body: "High-resolution cameras over a well-lit property, 24/7." },
];

export const features: { icon: IconName; title: string; body: string }[] = [
  { icon: "truck", title: "Drive-up units", body: "Pull your car or truck right up to your door. No long hallways and no elevators." },
  { icon: "clock", title: "Open every day", body: "Computerized gate access 365 days a year, 6 AM to 8 PM. Ask about extended hours for business or special events." },
  { icon: "pin", title: "Easy to reach", body: "Right off J Street, minutes from home or work, with Highway 99 close by." },
  // TODO(confirm with Eric): the free moving truck is mentioned for the company's locations generally.
  { icon: "box", title: "Moving supplies", body: "Boxes, tape and packing supplies in the office. Ask about the free moving truck." },
];

export const security = [
  { value: "1 code", label: "per tenant, logged on every entry and exit" },
  { value: "24/7", label: "high-resolution video coverage" },
  { value: "365", label: "days a year of gate access" },
];

export const story = [
  "Rapid Self Storage grew out of a Central Valley property management company that started managing residential rentals in 2004. As the company grew, it built its first self storage and retail complex in East Visalia, which opened in 2009.",
  "An expansion to Tulare followed with the full remodel of Rapid Self Storage. In late 2018 the company chose a new site in central Visalia, and its newest location on Santa Fe offers individual RV storage and drive-up units.",
  "Today Rapid Self Storage and its sister locations offer temperature controlled storage, drive-up units, indoor RV and boat storage, and a full moving center. The aim is the complete 110% satisfaction of every customer.",
];

export const timeline = [
  {
    year: "2009",
    text: "Mid Valley Storage opens its first facility in East Visalia, with drive-up units, temperature controlled units and outdoor parking.",
  },
  {
    year: "2012",
    text: "The parent company buys and fully remodels a self storage facility in Tulare. It becomes Rapid Self Storage.",
  },
  {
    year: "2018",
    text: "Mid Valley Storage buys property in central Visalia and begins construction.",
  },
  {
    year: "2020",
    text: "The newest facility opens at Santa Fe Rd and K Rd, with indoor RV storage and conventional units.",
  },
];

export const locations = [
  {
    name: "Rapid Self Storage",
    where: "1682 N J St, Tulare",
    what: "Drive-up units off J Street, close to Highway 99.",
    cta: "Pay your bill",
    href: site.payUrl,
    primary: true,
  },
  {
    name: "Visalia Noble",
    where: "Mid Valley Storage",
    what: "Our sister location in Visalia.",
    cta: "Log in or reserve",
    href: site.sisterLoginUrl,
    primary: false,
  },
  {
    name: "Visalia Santa Fe",
    where: "Santa Fe Rd and K Rd, Visalia",
    what: "Indoor RV storage and conventional units.",
    cta: "Log in or reserve",
    href: site.sisterLoginUrl,
    primary: false,
  },
];

export const contactLocations = [
  { value: "tulare", label: "Tulare, 1682 N J St" },
  { value: "noble", label: "Visalia Noble" },
  { value: "santa-fe", label: "Visalia Santa Fe" },
] as const;
