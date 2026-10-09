"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    __rssMotion?: boolean;
  }
}

function countUp(el: HTMLElement) {
  const target = Number(el.dataset.count);
  const start = performance.now();
  const duration = 1400;
  const tick = (now: number) => {
    const t = Math.min(1, (now - start) / duration);
    el.textContent = String(Math.round(target * (1 - Math.pow(1 - t, 3))));
    if (t < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

// Scroll behaviour for the server-rendered page: reveal-on-scroll ([data-reveal]), count-up numbers
// ([data-count]), header and mobile call bar state on <html>, and the nav link for the section in view.
// The inline script in the layout adds `.js` before paint; CSS only hides [data-reveal] under it.
export function Motion() {
  useEffect(() => {
    window.__rssMotion = true;
    const root = document.documentElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const reveal = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-in");
          reveal.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );
    document.querySelectorAll("[data-reveal]").forEach((el) => reveal.observe(el));

    const counters = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          counters.unobserve(entry.target);
          countUp(entry.target as HTMLElement);
        }
      },
      { threshold: 0.6 },
    );
    if (!reduce) {
      document.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => {
        el.textContent = "0";
        counters.observe(el);
      });
    }

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        root.toggleAttribute("data-scrolled", window.scrollY > 24);
        root.toggleAttribute("data-past-hero", window.scrollY > window.innerHeight * 0.75);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const links = new Map<string, HTMLAnchorElement>();
    document.querySelectorAll<HTMLAnchorElement>('.nav a[href^="#"]').forEach((a) => links.set(a.hash.slice(1), a));
    const spy = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const link = links.get(entry.target.id);
          if (!link) continue;
          if (entry.isIntersecting) {
            links.forEach((l) => l.removeAttribute("data-active"));
            link.setAttribute("data-active", "");
          } else {
            link.removeAttribute("data-active");
          }
        }
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    links.forEach((_, id) => {
      const section = document.getElementById(id);
      if (section) spy.observe(section);
    });

    return () => {
      reveal.disconnect();
      counters.disconnect();
      spy.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return null;
}
