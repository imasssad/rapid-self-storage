// All business content lives here so it can be edited without touching the layout.
// Copy follows the live WordPress site (content inventory, Oct 2026), lightly edited.

export const site = {
  name: "Rapid Self Storage",
  url: "https://rapidselfstorage.com",
  tagline: "Tulare's best choice for convenient, safe and affordable self storage.",
  description:
    "Tulare's best choice for convenient, safe and affordable self storage. Drive-up units from 5×5 to 20×20, month-to-month rentals with no deposit, and an individual gate code for every tenant.",
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
  // Internal staff schedule from the old /employee page. Not linked from the public site.
  employeeCalendarUrl:
    "https://calendar.google.com/calendar/embed?src=9kca4svl1gpf51h21irc0jd248%40group.calendar.google.com&ctz=America%2FLos_Angeles",
} as const;

export const nav = [
  { href: "#units", label: "Unit sizes" },
  { href: "#features", label: "Features" },
  { href: "#story", label: "About" },
  { href: "#locations", label: "Locations" },
  { href: "#faq", label: "FAQ" },
  { href: "#visit", label: "Contact" },
];

// Placeholder photos (free, Unsplash License). The real photos are on the old WordPress site under
// /wp-content/uploads; download them into /public/photos and point each `src` at the local file:
//   hero      2020/09/OverviewRSS-scaled.jpg (or 2020/06/Night-Full-Elevation1-1.jpg)
//   driveUp   GOPR0415-scaled.jpg (Drive-up Units)
//   door      2020/09/Office1-2048x1536.jpg (Security)
//   facility  2020/06/Office-Elevation2.jpg
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

export type IconName =
  | "tag"
  | "key"
  | "people"
  | "camera"
  | "truck"
  | "clock"
  | "pin"
  | "box"
  | "shield"
  | "medal"
  | "calendar";

export const specs: { icon: IconName; label: string; value: string }[] = [
  { icon: "clock", label: "Gate hours", value: "6 AM to 8 PM daily" },
  { icon: "tag", label: "Terms", value: "Monthly, no deposit" },
  { icon: "box", label: "Unit sizes", value: "5×5 up to 20×20" },
  { icon: "people", label: "In the office", value: "Staff six days a week" },
];

// The old site's hero slider taglines, reused as the four "why" points.
export const highlights: { icon: IconName; title: string; body: string }[] = [
  { icon: "tag", title: "Upfront, flat rate", body: "Month to month with no deposit and no long-term contract." },
  {
    icon: "key",
    title: "Secure, individual gate access",
    body: "The gate keypad recognizes your name and unit number, and every entry is logged.",
  },
  {
    icon: "people",
    title: "Friendly, professional service",
    body: "Managers on site six days a week to help you find the right fit.",
  },
  {
    icon: "camera",
    title: "State-of-the-art security",
    body: "High-resolution cameras over a well-lit property, monitored 24/7.",
  },
];

export const about = [
  "Welcome to Rapid Self Storage. Whether you need a place for holiday decorations or want to organize things from around the home or office, we've got the space, and the friendly, professional service to go with it.",
  "Attention to detail shows from the moment the gate keypad recognizes your name and unit number, to the well-lit, 24/7 video-monitored property and the complete moving supply center in the office.",
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

export const steps: { icon: IconName; title: string; body: string }[] = [
  {
    icon: "box",
    title: "Pick your size",
    body: "Compare the floor plans above, or call and a manager will help you choose the perfect size.",
  },
  {
    icon: "calendar",
    title: "Reserve online",
    body: "Book your unit through the online reservation portal in a few minutes. No deposit needed.",
  },
  {
    icon: "key",
    title: "Drive up and move in",
    body: "Get your personal gate code, pull up to your door and unload. Storage should be simple.",
  },
];

export const features: { icon: IconName; title: string; body: string }[] = [
  {
    icon: "truck",
    title: "Drive-up units",
    body: "Pull your car or truck right up to your unit. No long hallways, no elevators. Moving is stressful enough; storage should be simple.",
  },
  {
    icon: "people",
    title: "Friendly staff",
    body: "Our professional staff is on site six days a week. We like to call ourselves professional Tetris players, and we'll help you find the right size.",
  },
  {
    icon: "clock",
    title: "Convenient access",
    body: "Computerized gate access 365 days a year, 6 AM to 8 PM. Extended hours for business customers or special events, plus online payments and auto-pay.",
  },
  {
    icon: "pin",
    title: "Easy to reach",
    body: "Right off J Street, minutes from home or work, with quick freeway access to Highway 99. Easy to find and close to you.",
  },
  {
    icon: "medal",
    title: "Military discounts",
    body: "We offer discounts to our true MVPs: military and first responders with a valid ID. Contact the office for details.",
  },
  // TODO(confirm with Eric): the free moving truck is mentioned for the company's locations generally.
  {
    icon: "box",
    title: "Moving supplies",
    body: "A complete moving supply center in the office with boxes, tape and packing materials. Ask about the free moving truck.",
  },
];

// The old site's facility feature bullets, shown in the scrolling strip.
export const amenities = [
  "Friendly, knowledgeable staff",
  "Access 7 days a week",
  "Huge variety of sizes",
  "Ground-floor drive-up units",
  "Easy road access",
  "No deposit required",
  "Month-to-month rentals",
  "State-of-the-art security",
  "Computerized gate access",
  "24/7 video surveillance",
  "Moving supplies",
  "Close to Highway 99",
];

export const security = [
  { value: "1 code", label: "per tenant, logged on every entry and exit" },
  { value: "24/7", label: "high-resolution video coverage" },
  { value: "365", label: "days a year of gate access" },
];

export const story = [
  "Rapid Self Storage has deep roots in the Central Valley. Its parent company started in 2004 as a property management company for residential real estate, and in 2009 it built its first ground-up project: a self storage and retail complex in East Visalia.",
  "Thousands of happy customers later, the company expanded to Tulare with the extensive remodel of Rapid Self Storage. In late 2018 it chose a new site in central Visalia, and its newest location on Santa Fe offers individual RV storage and drive-up units.",
  "Today Rapid Self Storage and its sister locations offer temperature controlled storage, drive-up units, indoor RV and boat storage, and a full moving center to make storage as easy as possible.",
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
    text: "Mid Valley Storage acquires property in central Visalia and begins building the area's premier self storage.",
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

export const faqs = [
  {
    q: "Do I need a deposit or a long-term contract?",
    a: "No. Units rent month to month with no deposit and no long-term contract.",
  },
  {
    q: "When can I get to my unit?",
    a: "The computerized gate is open 6 AM to 8 PM, 365 days a year. Extended gate hours are available for business customers and special events.",
  },
  {
    q: "What sizes do you have?",
    a: "Units range from small 5×5 to oversized 20×20. Call the office to talk through what fits, and for current availability and rates.",
  },
  {
    q: "How do I pay my bill?",
    a: "Pay online through the customer portal, where you can also set up auto-pay.",
  },
  {
    q: "How secure is the facility?",
    a: "Every tenant gets a unique gate code that logs each entry and exit. High-resolution cameras cover the well-lit property 24/7, and staff review footage and gate logs regularly.",
  },
  {
    q: "Do you offer discounts?",
    a: "Yes. Military and first responders with a valid ID get a discount. Contact the office for details.",
  },
  {
    q: "Do you sell moving supplies?",
    a: "Yes. The office has a complete moving supply center with boxes, tape and packing materials.",
  },
];

export const contactLocations = [
  { value: "tulare", label: "Tulare, 1682 N J St" },
  { value: "noble", label: "Visalia Noble" },
  { value: "santa-fe", label: "Visalia Santa Fe" },
] as const;
