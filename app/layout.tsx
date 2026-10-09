import type { Metadata, Viewport } from "next";
import "@fontsource-variable/schibsted-grotesk/index.css";
import "./globals.css";
import { Motion } from "@/components/Motion";
import { site } from "@/lib/site";

// Runs before first paint: lets CSS hide [data-reveal] content only when JS is on, and un-hides it
// if the app bundle hasn't started within 4s so a slow or failed load never leaves the page blank.
const bootScript = `(function(){var d=document.documentElement;d.classList.add("js");setTimeout(function(){if(!window.__rssMotion)d.classList.remove("js")},4000)})()`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Rapid Self Storage | Drive-up storage in Tulare, CA",
    template: "%s | Rapid Self Storage",
  },
  description: site.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: site.url,
    siteName: site.name,
    title: "Rapid Self Storage | Drive-up storage in Tulare, CA",
    description: site.description,
    locale: "en_US",
  },
  formatDetection: { telephone: true, address: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0f1e3a",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body>
        {children}
        <Motion />
      </body>
    </html>
  );
}
