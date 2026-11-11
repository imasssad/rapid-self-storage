import { cacheLife, cacheTag } from "next/cache";
import { Contact } from "@/components/Contact";
import { CtaBand } from "@/components/CtaBand";
import { EditBar } from "@/components/EditBar";
import { Faq } from "@/components/Faq";
import { Features } from "@/components/Features";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Highlights } from "@/components/Highlights";
import { Locations } from "@/components/Locations";
import { Marquee } from "@/components/Marquee";
import { MobileCta } from "@/components/MobileCta";
import { Motion } from "@/components/Motion";
import { Reviews } from "@/components/Reviews";
import { Security } from "@/components/Security";
import { SpecialsBar } from "@/components/SpecialsBar";
import { Steps } from "@/components/Steps";
import { Story } from "@/components/Story";
import { Units } from "@/components/Units";
import { brand } from "@/lib/brand";
import { CONTENT_TAG, getSiteContent } from "@/lib/content";
import type { SiteContent } from "@/lib/content-schema";
import { DAYS, phoneE164Dashed } from "@/lib/format";

function structuredData(c: SiteContent) {
  const office = c.contact.officeHours.flatMap((d, i) =>
    d.open ? [{ "@type": "OpeningHoursSpecification", dayOfWeek: DAYS[i], opens: d.opens, closes: d.closes }] : [],
  );
  const offers = c.units.items
    .filter((u) => u.price !== null)
    .map((u) => ({
      "@type": "Offer",
      name: `${u.width}×${u.depth} storage unit`,
      price: u.price,
      priceCurrency: "USD",
      availability: u.soldOut ? "https://schema.org/SoldOut" : "https://schema.org/InStock",
      priceSpecification: { "@type": "UnitPriceSpecification", price: u.price, priceCurrency: "USD", unitText: "MONTH" },
    }));
  return {
    "@context": "https://schema.org",
    "@type": "SelfStorage",
    name: c.navbar.name,
    url: brand.url,
    telephone: phoneE164Dashed(c.contact.phone),
    description: brand.description,
    address: {
      "@type": "PostalAddress",
      streetAddress: c.contact.street,
      addressLocality: c.contact.city,
      addressRegion: c.contact.region,
      postalCode: c.contact.postalCode,
      addressCountry: "US",
    },
    hasMap: c.contact.mapsUrl,
    sameAs: c.contact.instagramUrl ? [c.contact.instagramUrl] : undefined,
    image: c.photos.hero.src.startsWith("/") ? `${brand.url}${c.photos.hero.src}` : c.photos.hero.src,
    logo: c.navbar.logo.src ? `${brand.url}${c.navbar.logo.src}` : undefined,
    openingHoursSpecification: [
      ...office,
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [...DAYS],
        opens: c.contact.gateOpens,
        closes: c.contact.gateCloses,
        description: "Gate access hours",
      },
    ],
    makesOffer: offers.length ? offers : undefined,
  };
}

// The whole page is cached and tagged: saving in the admin panel calls updateTag("site-content"), and the
// page otherwise refreshes hourly (which also keeps the specials dates and the footer year current).
export default async function Home() {
  "use cache";
  cacheLife("hours");
  cacheTag(CONTENT_TAG);

  const c = await getSiteContent();
  const now = Date.now();
  const { home, photos } = c;

  return (
    <>
      <a className="skip" href="#top">
        Skip to content
      </a>
      <SpecialsBar specials={c.specials} now={now} reserveUrl={c.contact.reserveUrl} />
      <Header contact={c.contact} navbar={c.navbar} locations={c.locations.items} />
      <main id="top">
        <Hero hero={home.hero} highlights={home.highlights} contact={c.contact} photo={photos.hero} />
        <Highlights why={home.why} highlights={home.highlights} />
        <Units units={c.units} contact={c.contact} />
        <Steps steps={home.steps} contact={c.contact} />
        <Features features={home.features} photo={photos.driveUp} />
        {home.showAmenities && <Marquee items={home.amenities} />}
        <Security security={home.security} photo={photos.door} />
        <Story about={c.about} />
        <Locations locations={c.locations} />
        <Reviews reviews={c.reviews} />
        <Faq faq={home.faq} contact={c.contact} />
        <Contact section={home.contact} contact={c.contact} locations={c.locations.items} />
        <CtaBand cta={home.cta} contact={c.contact} photo={photos.facility} />
      </main>
      <Footer contact={c.contact} navbar={c.navbar} locations={c.locations.items} year={new Date(now).getFullYear()} />
      <MobileCta bar={home.mobileBar} contact={c.contact} />
      <EditBar />
      {/* Inside the page (not the root layout) so its effects run only after this page has hydrated. */}
      <Motion />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData(c)).replace(/</g, "\\u003c") }} />
    </>
  );
}
