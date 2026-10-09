"use client";

import { useEffect, useRef } from "react";
import { nav, site } from "@/lib/site";

export function MobileMenu() {
  const ref = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current?.open && !ref.current.contains(e.target as Node)) ref.current.open = false;
    };
    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && ref.current) ref.current.open = false;
    };
    document.addEventListener("click", close);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("click", close);
      document.removeEventListener("keydown", esc);
    };
  }, []);

  return (
    <details className="menu" ref={ref}>
      <summary aria-label="Open menu">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      </summary>
      <div className="menu-panel">
        {nav.map((n) => (
          <a key={n.href} href={n.href} onClick={() => ref.current && (ref.current.open = false)}>
            {n.label}
          </a>
        ))}
        <a href={site.payUrl}>Pay your bill</a>
      </div>
    </details>
  );
}
