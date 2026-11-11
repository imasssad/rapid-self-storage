"use client";

import { useEffect, useRef } from "react";
import type { SiteContent } from "@/lib/content-schema";
import { externalLinkProps } from "@/lib/links";
import { menuHref, otherLocationLogins, type MenuLink } from "@/lib/nav";

type Props = { links: MenuLink[]; payUrl: string; locations: SiteContent["locations"]["items"]; phone: string; phoneHref: string };

export function MobileMenu({ links, payUrl, locations, phone, phoneHref }: Props) {
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
      <summary aria-label="Menu">
        <span className="burger" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
      </summary>
      <div className="menu-panel">
        {links.map((n, i) => (
          <a key={i} href={menuHref(n)} {...externalLinkProps(menuHref(n))} onClick={() => ref.current && (ref.current.open = false)}>
            {n.label}
          </a>
        ))}
        <hr />
        <a href={payUrl} {...externalLinkProps(payUrl)}>
          Pay your bill
        </a>
        {otherLocationLogins(locations).map((l) => (
          <a key={l.href} href={l.href} {...externalLinkProps(l.href)}>
            {l.label}
          </a>
        ))}
        <a href={phoneHref}>Call {phone}</a>
      </div>
    </details>
  );
}
