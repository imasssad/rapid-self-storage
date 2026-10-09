import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Highlights } from "@/components/Highlights";
import { Units } from "@/components/Units";
import { Features } from "@/components/Features";
import { Security } from "@/components/Security";
import { CtaBand } from "@/components/CtaBand";
import { Story } from "@/components/Story";
import { Locations } from "@/components/Locations";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { photos, site } from "@/lib/site";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SelfStorage",
  name: site.name,
  url: site.url,
  telephone: "+1-559-688-4787",
  description: site.description,
  address: {
    "@type": "PostalAddress",
    streetAddress: site.address.street,
    addressLocality: site.address.city,
    addressRegion: site.address.region,
    postalCode: site.address.postalCode,
    addressCountry: "US",
  },
  hasMap: site.mapsUrl,
  sameAs: [site.instagram.url],
  image: photos.hero.src,
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    opens: "06:00",
    closes: "20:00",
    description: "Gate access hours",
  },
};

export default function Home() {
  return (
    <>
      <a className="skip" href="#top">
        Skip to content
      </a>
      <Header />
      <main id="top">
        <Hero />
        <Highlights />
        <Units />
        <Features />
        <Security />
        <Story />
        <Locations />
        <Contact />
        <CtaBand />
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
