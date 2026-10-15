"use client";

// The start screen's map: the real homepage, small, with every part outlined and labelled. Click a part to change
// it. The numbered list beside it is the same thing in words (and the way in for keyboard and screen reader users).
import { useRef, useState } from "react";
import type { SiteContent } from "@/lib/content-schema";
import { screenKeys, screens, type ScreenKey } from "@/lib/screens";
import { PreviewFrame } from "./PreviewFrame";
import type { PreviewZone } from "./preview-protocol";
import { visibilityNote } from "./visibility";

const pageKeys = screenKeys.filter((k) => screens[k].group === "page");
const numberOf = (k: ScreenKey) => pageKeys.indexOf(k) + 1;

export function HomeMap({ content }: { content: SiteContent }) {
  const [active, setActive] = useState<ScreenKey | null>(null);
  const box = useRef<HTMLDivElement>(null);
  const zones = useRef<{ list: PreviewZone[]; scale: number }>({ list: [], scale: 1 });

  function point(k: ScreenKey) {
    setActive(k);
    const z = zones.current.list.find((x) => x.screen === k);
    if (z && box.current) box.current.scrollTo({ top: Math.max(0, z.top * zones.current.scale - 24), behavior: "smooth" });
  }

  return (
    <div className="home-map">
      <div ref={box} className="map-box" onMouseLeave={() => setActive(null)}>
        <PreviewFrame
          target="all"
          content={content}
          title="Your homepage"
          onLayout={({ zones: list, scale }) => {
            zones.current = { list, scale };
          }}
          overlay={({ zones: list, scale }) =>
            list.map((z) => {
              const n = numberOf(z.screen);
              const label = n ? `${n}. ${screens[z.screen].title}` : screens[z.screen].title;
              return (
                <a
                  key={z.part}
                  href={`/admin/${z.screen}`}
                  className={active === z.screen ? "map-zone is-active" : "map-zone"}
                  style={{ top: z.top * scale, height: z.height * scale }}
                  onMouseEnter={() => setActive(z.screen)}
                  tabIndex={-1}
                  aria-hidden="true"
                >
                  <span>{label}</span>
                </a>
              );
            })
          }
        />
      </div>

      <ol className="map-list">
        {pageKeys.map((k) => {
          const note = visibilityNote(k, content);
          return (
            <li key={k}>
              <a
                href={`/admin/${k}`}
                className={active === k ? "is-active" : undefined}
                onMouseEnter={() => point(k)}
                onFocus={() => point(k)}
              >
                <span className="map-num" aria-hidden="true">
                  {numberOf(k)}
                </span>
                <span>
                  <strong>{screens[k].title}</strong>
                  <span>{screens[k].blurb}</span>
                  {note && !note.ok && <em>{note.text}</em>}
                </span>
              </a>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
