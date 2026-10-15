"use client";

import { useEffect, useState } from "react";
import { screens, type ScreenKey } from "@/lib/screens";
import { EDITOR_HINT_COOKIE } from "@/lib/editor-hint";
import { Icon } from "./Icon";

// The homepage's parts, matched to the editor screen that changes each one.
const parts: [string, ScreenKey][] = [
  ["#specials-bar", "specials"],
  ["#top > .hero", "hero"],
  ["#why", "why"],
  ["#units", "units"],
  ["#how", "steps"],
  ["#features", "features"],
  ["#amenities", "strip"],
  ["#security", "security"],
  ["#story", "story"],
  ["#locations", "locations"],
  ["#reviews", "reviews"],
  ["#faq", "faq"],
  ["#visit", "contact"],
  ["#reserve", "cta"],
  [".site-footer", "contact"],
];

// For people signed in to the website editor only (see EDITOR_HINT_COOKIE): a small bar that names the editor
// screen for the part of the page being looked at, with a link straight to it. Visitors never see it.
export function EditBar() {
  const [on, setOn] = useState(false);
  const [current, setCurrent] = useState<ScreenKey>("hero");

  useEffect(() => {
    if (!document.cookie.split("; ").includes(`${EDITOR_HINT_COOKIE}=1`)) return;
    setOn(true);
    let frame = 0;
    const update = () => {
      frame = 0;
      const line = window.innerHeight * 0.4;
      for (const [selector, key] of parts) {
        const r = document.querySelector(selector)?.getBoundingClientRect();
        if (r && r.top <= line && r.bottom > line) return setCurrent(key);
      }
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  if (!on) return null;
  return (
    <aside className="edit-bar" aria-label="Website editor">
      <a className="edit-bar-main" href={`/admin/${current}`}>
        <Icon name="pen" className="icon-xs" />
        <span>
          Edit this part: <strong>{screens[current].title}</strong>
        </span>
      </a>
      <a className="edit-bar-home" href="/admin">
        Editor
      </a>
    </aside>
  );
}
