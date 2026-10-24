"use client";

// The inside of a live preview (app/admin/preview). The editor sends the draft content with postMessage and this
// draws the same section components the website uses, so the preview always looks like the real thing. It runs
// in its own frame so the website's styles and screen-size rules apply exactly as they do on the site.
import { Component, useEffect, useRef, useState, type ReactNode } from "react";
import { Contact } from "@/components/Contact";
import { CtaBand } from "@/components/CtaBand";
import { Faq } from "@/components/Faq";
import { Features } from "@/components/Features";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Highlights } from "@/components/Highlights";
import { Locations } from "@/components/Locations";
import { Marquee } from "@/components/Marquee";
import { MobileCta } from "@/components/MobileCta";
import { Reviews } from "@/components/Reviews";
import { Security } from "@/components/Security";
import { SpecialsBar } from "@/components/SpecialsBar";
import { Steps } from "@/components/Steps";
import { Story } from "@/components/Story";
import { Units } from "@/components/Units";
import type { SiteContent } from "@/lib/content-schema";
import { specialsActive } from "@/lib/format";
import type { ScreenKey } from "@/lib/screens";
import { PREVIEW_MSG, type PreviewLayout, type PreviewTarget } from "./preview-protocol";

type Ctx = { c: SiteContent; now: number; target: PreviewTarget };
type Part = {
  id: string;
  screen: ScreenKey;
  render: (x: Ctx) => ReactNode;
  /** Why the website doesn't show this part right now, if it doesn't. */
  hidden?: (x: Ctx) => string | null;
};

// The homepage, top to bottom.
const parts: Part[] = [
  {
    id: "specials",
    screen: "specials",
    // On its own screen the bar is always drawn, so it can be checked before switching it on.
    render: ({ c, now, target }) => <SpecialsBar specials={c.specials} now={now} reserveUrl={c.contact.reserveUrl} preview={target === "specials"} />,
    hidden: ({ c, now, target }) => {
      if (!c.specials.headline) return "Add a headline to show the special offer bar.";
      if (target === "specials") return null;
      return specialsActive(c.specials, now) ? null : "The special offer bar isn't showing right now.";
    },
  },
  { id: "header", screen: "navbar", render: ({ c }) => <Header contact={c.contact} navbar={c.navbar} locations={c.locations.items} /> },
  {
    id: "hero",
    screen: "hero",
    render: ({ c }) => <Hero hero={c.home.hero} highlights={c.home.highlights} contact={c.contact} photo={c.photos.hero} />,
  },
  { id: "why", screen: "why", render: ({ c }) => <Highlights why={c.home.why} highlights={c.home.highlights} /> },
  { id: "units", screen: "units", render: ({ c }) => <Units units={c.units} contact={c.contact} /> },
  { id: "steps", screen: "steps", render: ({ c }) => <Steps steps={c.home.steps} contact={c.contact} /> },
  { id: "features", screen: "features", render: ({ c }) => <Features features={c.home.features} photo={c.photos.driveUp} /> },
  {
    id: "strip",
    screen: "strip",
    render: ({ c }) => <Marquee items={c.home.amenities} />,
    hidden: ({ c }) =>
      !c.home.showAmenities ? "The scrolling strip is switched off." : c.home.amenities.length ? null : "The scrolling strip is hidden because it has no phrases.",
  },
  { id: "security", screen: "security", render: ({ c }) => <Security security={c.home.security} photo={c.photos.door} /> },
  { id: "story", screen: "story", render: ({ c }) => <Story about={c.about} /> },
  { id: "locations", screen: "locations", render: ({ c }) => <Locations locations={c.locations} /> },
  {
    id: "reviews",
    screen: "reviews",
    render: ({ c }) => <Reviews reviews={c.reviews} />,
    hidden: ({ c }) => (c.reviews.items.some((r) => r.enabled) ? null : "The reviews section is hidden until at least one review is switched on."),
  },
  {
    id: "faq",
    screen: "faq",
    render: ({ c }) => <Faq faq={c.home.faq} contact={c.contact} />,
    hidden: ({ c }) => (c.home.faq.items.length ? null : "The questions section is hidden because it has no questions."),
  },
  {
    id: "contact",
    screen: "contact",
    render: ({ c }) => <Contact section={c.home.contact} contact={c.contact} locations={c.locations.items} />,
  },
  { id: "cta", screen: "cta", render: ({ c }) => <CtaBand cta={c.home.cta} contact={c.contact} photo={c.photos.facility} /> },
  { id: "footer", screen: "contact", render: ({ c, now }) => <Footer contact={c.contact} navbar={c.navbar} locations={c.locations.items} year={new Date(now).getFullYear()} /> },
  // Only on phones, fixed to the bottom of the screen; the preview draws it in place.
  {
    id: "mobilebar",
    screen: "contact",
    render: ({ c }) => (
      <div className="preview-mobilebar">
        <MobileCta bar={c.home.mobileBar} contact={c.contact} />
      </div>
    ),
  },
];

/** Which parts each screen's preview shows. */
const shown: Record<PreviewTarget, string[]> = {
  all: parts.map((p) => p.id),
  specials: ["specials", "header"],
  navbar: ["header"],
  hero: ["hero"],
  why: ["why"],
  units: ["units"],
  steps: ["steps"],
  features: ["features"],
  strip: ["strip"],
  security: ["security"],
  story: ["story"],
  locations: ["locations"],
  reviews: ["reviews"],
  faq: ["faq"],
  cta: ["cta"],
  contact: ["header", "contact", "footer", "mobilebar"],
  photos: ["hero", "features", "security", "cta"],
  settings: [],
};

/** Half-typed content can trip a section up; show a note instead of a blank preview, and retry on the next change. */
class Guard extends Component<{ attempt: number; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidUpdate(prev: { attempt: number }) {
    if (this.state.failed && prev.attempt !== this.props.attempt) this.setState({ failed: false });
  }
  render() {
    return this.state.failed ? <p className="preview-note">The preview will come back once the fields marked in red are filled in.</p> : this.props.children;
  }
}

export function PreviewCanvas() {
  const [state, setState] = useState<{ target: PreviewTarget; content: SiteContent; now: number; n: number } | null>(null);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // The website hides [data-reveal] content until it scrolls into view; in a preview everything is shown at once.
    document.documentElement.classList.remove("js");
    window.__rssMotion = true;
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== location.origin || e.source !== window.parent) return;
      const d = e.data as { type?: string; target: PreviewTarget; content: SiteContent; now: number };
      if (d?.type === PREVIEW_MSG.content) setState((s) => ({ target: d.target, content: d.content, now: d.now, n: (s?.n ?? 0) + 1 }));
    };
    window.addEventListener("message", onMessage);
    window.parent.postMessage({ type: PREVIEW_MSG.ready }, location.origin);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  // Report the height and where each part sits, so the editor can size the frame and the overview can link each part.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const report = () => {
      const zones = [...el.querySelectorAll<HTMLElement>("[data-screen]")].map((z) => ({
        screen: z.dataset.screen as ScreenKey,
        part: z.dataset.part ?? "",
        top: z.offsetTop,
        height: z.offsetHeight,
      }));
      const layout: PreviewLayout = { height: el.offsetHeight, zones };
      window.parent.postMessage({ type: PREVIEW_MSG.layout, ...layout }, location.origin);
    };
    const ro = new ResizeObserver(report);
    ro.observe(el);
    for (const child of el.children) ro.observe(child);
    report();
    return () => ro.disconnect();
  }, [state?.target, state?.n]);

  if (!state) return <div ref={root} className="preview-root" />;
  const ctx: Ctx = { c: state.content, now: state.now, target: state.target };
  const ids = shown[state.target] ?? [];
  return (
    <div ref={root} className="preview-root" inert>
      {parts
        .filter((p) => ids.includes(p.id))
        .map((p) => {
          const reason = p.hidden?.(ctx) ?? null;
          if (reason && state.target === "all") return null; // the overview shows the page as visitors see it
          return (
            <div key={p.id} data-screen={p.screen} data-part={p.id}>
              {reason ? <p className="preview-note">{reason}</p> : <Guard attempt={state.n}>{p.render(ctx)}</Guard>}
            </div>
          );
        })}
    </div>
  );
}
