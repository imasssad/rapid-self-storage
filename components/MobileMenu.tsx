"use client";

import { useEffect, useRef } from "react";
import { nav } from "@/lib/nav";

type Props = { payUrl: string; sisterLoginUrl: string; phone: string; phoneHref: string };

export function MobileMenu({ payUrl, sisterLoginUrl, phone, phoneHref }: Props) {
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
        {nav.map((n) => (
          <a key={n.href} href={n.href} onClick={() => ref.current && (ref.current.open = false)}>
            {n.label}
          </a>
        ))}
        <hr />
        <a href={payUrl}>Pay your bill</a>
        {sisterLoginUrl && <a href={sisterLoginUrl}>Visalia locations login</a>}
        <a href={phoneHref}>Call {phone}</a>
      </div>
    </details>
  );
}
