// Default website content. This file is only the starting point: once the owner saves anything in the admin
// panel, the live content comes from content/site.json in the Blob store (see lib/content.ts), and new fields
// added to the schema later are filled in from here. Copy follows the old WordPress site, lightly edited.
// No made-up facts: prices, office hours and reviews are left empty until the owner fills them in.
import type { SiteContent } from "./content-schema";

const payUrl =
  "https://rental-center.storedge.com/?companyId=ee6dd943-e3a5-49c9-af42-8bc54fe490cc&facilityId=f09f5cd3-ddb3-448e-89a4-961373ade47f#/login";
const sisterLoginUrl = "https://ecom.quikstor.com/midvalleystorage/Account/Login";

const closedDay = { open: false, opens: "09:00", closes: "17:00" };

export const defaultContent: SiteContent = {
  version: 1,

  specials: {
    enabled: false,
    headline: "",
    text: "",
    buttonLabel: "",
    buttonUrl: "",
    startDate: "",
    endDate: "",
  },

  navbar: {
    logo: { src: "", alt: "", credit: "" },
    name: "Rapid Self Storage",
    tagline: "",
    // The menu links point at the homepage's sections.
    links: [
      { label: "Unit sizes", to: "units", url: "" },
      { label: "Features", to: "features", url: "" },
      { label: "About", to: "story", url: "" },
      { label: "Locations", to: "locations", url: "" },
      { label: "FAQ", to: "faq", url: "" },
      { label: "Contact", to: "visit", url: "" },
    ],
    secondButton: { label: "Pay bill", to: "pay", url: "" },
    button: { label: "Reserve a unit", to: "reserve", url: "" },
  },

  // TODO(confirm with Eric): the old site only states "5×5 to 20×20".
  // The in-between sizes are typical industry sizes, not confirmed inventory. Prices are left empty.
  units: {
    heading: "Pick a size and see the floor plan.",
    intro:
      "From small 5×5 to oversized 20×20, every plan is drawn on a one-foot grid so you can compare at a glance. Not sure what fits? Our managers help people choose every day.",
    note: "Availability and rates change. Call (559) 688-4787 for current pricing.",
    button: { label: "Reserve this size", to: "reserve", url: "" },
    soldOutButton: { label: "Join the waitlist (call)", to: "call", url: "" },
    items: [
      { id: "5x5", width: 5, depth: 5, name: "Small", description: "Holiday decorations, boxes and files.", price: null, soldOut: false },
      { id: "5x10", width: 5, depth: 10, name: "Small plus", description: "Boxes and small furniture from a bedroom.", price: null, soldOut: false },
      { id: "10x10", width: 10, depth: 10, name: "Medium", description: "The contents of a one-bedroom apartment.", price: null, soldOut: false },
      { id: "10x15", width: 10, depth: 15, name: "Medium plus", description: "A two-bedroom home's furniture and boxes.", price: null, soldOut: false },
      { id: "10x20", width: 10, depth: 20, name: "Large", description: "A larger home with appliances.", price: null, soldOut: false },
      { id: "20x20", width: 20, depth: 20, name: "Oversized", description: "A whole house, or business inventory and equipment.", price: null, soldOut: false },
    ],
  },

  contact: {
    phone: "(559) 688-4787",
    street: "1682 N J St",
    city: "Tulare",
    region: "CA",
    postalCode: "93274",
    mapsUrl: "https://goo.gl/maps/LrHat5624ZYiJjnb6",
    gateOpens: "06:00",
    gateCloses: "20:00",
    // Monday first. Office hours aren't published anywhere yet, so every day starts closed (hidden on the site).
    officeHours: [closedDay, closedDay, closedDay, closedDay, closedDay, closedDay, closedDay],
    payUrl,
    reserveUrl: "https://ecom.quikstor.com/rapid_self_storage/Account/Login",
    sisterLoginUrl,
    instagramUrl: "https://www.instagram.com/rapidselfstorage",
    instagramHandle: "@rapidselfstorage",
  },

  home: {
    hero: {
      headline: "Drive up, unload and",
      headlineAccent: "get on with your day.",
      intro:
        "Tulare's best choice for convenient, safe and affordable self storage. Clean ground-floor units from 5×5 to 20×20, a personal gate code for every tenant, and friendly managers on site six days a week.",
      facts: [
        { label: "Terms", value: "Monthly, no deposit" },
        { label: "Unit sizes", value: "5×5 up to 20×20" },
        { label: "In the office", value: "Staff six days a week" },
      ],
      tenantTitle: "Already a tenant?",
      tenantText: "Log in to pay online, set up auto-pay or manage your unit.",
      button: { label: "Reserve a unit", to: "reserve", url: "" },
      secondButton: { label: "Find your size", to: "sizes", url: "" },
      tenantButton: { label: "Customer login & pay", to: "pay", url: "" },
    },
    why: {
      heading: "Convenient, safe and affordable, right here in Tulare.",
      paragraphs: [
        "Welcome to Rapid Self Storage. Whether you need a place for holiday decorations or want to organize things from around the home or office, we've got the space, and the friendly, professional service to go with it.",
        "Attention to detail shows from the moment the gate keypad recognizes your name and unit number, to the well-lit, 24/7 video-monitored property and the complete moving supply center in the office.",
      ],
      satisfaction: "Features aside, we have one focus: the complete satisfaction of every customer.",
    },
    // The old site's hero slider taglines. They also rotate at the top of the page.
    highlights: [
      { title: "Upfront, flat rate", body: "Month to month with no deposit and no long-term contract." },
      {
        title: "Secure, individual gate access",
        body: "The gate keypad recognizes your name and unit number, and every entry is logged.",
      },
      { title: "Friendly, professional service", body: "Managers on site six days a week to help you find the right fit." },
      { title: "State-of-the-art security", body: "High-resolution cameras over a well-lit property, monitored 24/7." },
    ],
    steps: {
      heading: "Rent a unit in three easy steps.",
      items: [
        {
          title: "Pick your size",
          body: "Compare the floor plans above, or call and a manager will help you choose the perfect size.",
        },
        {
          title: "Reserve online",
          body: "Book your unit through the online reservation portal in a few minutes. No deposit needed.",
        },
        {
          title: "Drive up and move in",
          body: "Get your personal gate code, pull up to your door and unload. Storage should be simple.",
        },
      ],
      button: { label: "Reserve a unit", to: "reserve", url: "" },
      secondButton: { label: "Call", to: "call", url: "" },
    },
    features: {
      heading: "Built for getting in and out.",
      intro:
        "Whether you're storing holiday decorations in the off season or a whole house during a move, our goal is to exceed your expectations with secure, convenient and spotlessly clean units.",
      photoTag: "Ground-floor, drive-up units",
      items: [
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
      ],
    },
    showAmenities: true,
    // The old site's facility feature bullets, shown in the scrolling strip.
    amenities: [
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
    ],
    security: {
      heading: "Your things are important to us too.",
      text: "The highest-resolution, most modern cameras cover the whole facility. Each tenant gets a unique gate code that logs every entry and exit, and our staff review footage and gate logs regularly.",
      stats: [
        { value: "1 code", label: "per tenant, logged on every entry and exit" },
        { value: "24/7", label: "high-resolution video coverage" },
        { value: "365", label: "days a year of gate access" },
      ],
      badgeTitle: "Unique gate code",
      badgeText: "Every entry and exit is logged",
    },
    faq: {
      heading: "Questions, answered.",
      intro: "Can't find what you need? Our managers are happy to help.",
      items: [
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
      ],
      button: { label: "Call", to: "call", url: "" },
    },
    contact: {
      heading: "Visit the office or send us a note.",
      formIntro: "We reply during office hours. For anything urgent, call the office.",
      button: { label: "Get directions", to: "directions", url: "" },
    },
    cta: {
      kicker: "Ready to get started?",
      heading: "Reserve your unit online in a few minutes.",
      text: "No deposit, month-to-month terms, and a gate code that is yours alone.",
      button: { label: "Reserve now", to: "reserve", url: "" },
      secondButton: { label: "Call", to: "call", url: "" },
    },
    mobileBar: {
      secondButton: { label: "Call", to: "call", url: "" },
      button: { label: "Reserve a unit", to: "reserve", url: "" },
    },
  },

  // Placeholder photos (free, Unsplash License). The real ones are on the old WordPress site under
  // /wp-content/uploads; upload them in the admin panel (Photos):
  //   hero      2020/09/OverviewRSS-scaled.jpg (or 2020/06/Night-Full-Elevation1-1.jpg)
  //   driveUp   GOPR0415-scaled.jpg (Drive-up Units)
  //   door      2020/09/Office1-2048x1536.jpg (Security)
  //   facility  2020/06/Office-Elevation2.jpg
  photos: {
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
  },

  about: {
    heading: "A Central Valley company since 2004.",
    paragraphs: [
      "Rapid Self Storage has deep roots in the Central Valley. Its parent company started in 2004 as a property management company for residential real estate, and in 2009 it built its first ground-up project: a self storage and retail complex in East Visalia.",
      "Thousands of happy customers later, the company expanded to Tulare with the extensive remodel of Rapid Self Storage. In late 2018 it chose a new site in central Visalia, and its newest location on Santa Fe offers individual RV storage and drive-up units.",
      "Today Rapid Self Storage and its sister locations offer temperature controlled storage, drive-up units, indoor RV and boat storage, and a full moving center to make storage as easy as possible.",
    ],
    timeline: [
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
    ],
  },

  locations: {
    heading: "One family of facilities across Tulare and Visalia.",
    items: [
      {
        name: "Rapid Self Storage",
        where: "1682 N J St, Tulare",
        description: "Drive-up units off J Street, close to Highway 99.",
        buttonLabel: "Pay your bill",
        buttonUrl: payUrl,
        highlight: true,
      },
      {
        name: "Visalia Noble",
        where: "Mid Valley Storage",
        description: "Our sister location in Visalia.",
        buttonLabel: "Log in or reserve",
        buttonUrl: sisterLoginUrl,
        highlight: false,
      },
      {
        name: "Visalia Santa Fe",
        where: "Santa Fe Rd and K Rd, Visalia",
        description: "Indoor RV storage and conventional units.",
        buttonLabel: "Log in or reserve",
        buttonUrl: sisterLoginUrl,
        highlight: false,
      },
    ],
  },

  // Real reviews only, added by the owner. The section stays hidden until one is switched on.
  reviews: {
    heading: "What our customers say",
    items: [],
  },

  settings: {
    contactEmails: [],
  },
};
