"use client";

// "What do you want to change?": searches screen names, everyday words for them (lib/screens.ts keywords)
// and every field label, and links straight to the field.
import { useId, useMemo, useState } from "react";
import { screenKeys, screens } from "@/lib/screens";
import { screenBlocks, type Field } from "./screen-fields";

type Entry = { href: string; title: string; where: string; strong: string; text: string; screenLevel: boolean };

const STOP = new Set(
  "a an and are can change changing do edit for from how i in is it make me my of on or our put set the this to update want we what where which with you your".split(" "),
);

const words = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9$%/ ]+/g, " ")
    .split(/\s+/)
    .filter((w) => w && !STOP.has(w))
    .map((w) => (w.length > 3 && w.endsWith("s") ? w.slice(0, -1) : w));

function buildIndex(owner: boolean): Entry[] {
  const out: Entry[] = [];
  for (const key of screenKeys) {
    const s = screens[key];
    if (s.ownerOnly && !owner) continue;
    out.push({ href: `/admin/${key}`, title: s.title, where: s.blurb, strong: [s.title, ...s.keywords].join(" "), text: s.blurb, screenLevel: true });
    const walk = (fields: Field[], path: string[], context: string) => {
      for (const f of fields) {
        if (f.kind === "group") {
          walk(f.fields, f.key ? [...path, f.key] : path, f.label);
          continue;
        }
        const href = `/admin/${key}#f-${[...path, f.key].join("-")}`;
        const where = [s.title, context].filter(Boolean).join(" › ");
        out.push({ href, title: f.label, where, strong: `${f.label} ${s.title}`, text: f.help ?? "", screenLevel: false });
        if (f.kind === "list") {
          for (const sub of f.fields) {
            if (sub.kind === "group") continue;
            out.push({
              href,
              title: `${sub.label} (for each ${f.itemName})`,
              where: [s.title, f.label].join(" › "),
              strong: `${sub.label} ${f.label} ${s.title}`,
              text: sub.help ?? "",
              screenLevel: false,
            });
          }
        }
      }
    };
    for (const block of screenBlocks[key]) walk(block.fields, block.path, block.title ?? "");
  }
  return out;
}

function search(index: Entry[], query: string): Entry[] {
  const terms = words(query);
  if (!terms.length) return [];
  const scored = index
    .map((e) => {
      const strong = ` ${words(e.strong).join(" ")}`;
      const text = ` ${words(`${e.where} ${e.text}`).join(" ")}`;
      let score = 0;
      let matched = 0;
      for (const t of terms) {
        if (strong.includes(` ${t}`)) {
          score += 3;
          matched++;
        } else if (text.includes(` ${t}`)) {
          score += 1;
          matched++;
        }
      }
      if (matched < Math.min(terms.length, 2) && matched < terms.length) score = 0;
      return { e, score: score + (e.screenLevel && score ? 0.5 : 0) };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);
  const seen = new Set<string>();
  const hits: Entry[] = [];
  for (const { e } of scored) {
    const k = `${e.href}|${e.title}`;
    if (seen.has(k)) continue;
    seen.add(k);
    hits.push(e);
    if (hits.length === 8) break;
  }
  return hits;
}

export function FindBox({ owner }: { owner: boolean }) {
  const index = useMemo(() => buildIndex(owner), [owner]);
  const [query, setQuery] = useState("");
  const hits = useMemo(() => search(index, query), [index, query]);
  const id = useId();
  const typed = words(query).length > 0;

  return (
    <div className="find" role="search">
      <label htmlFor={id} className="find-label">
        What do you want to change?
      </label>
      <input
        id={id}
        type="search"
        className="find-input"
        placeholder="For example: price, hours, phone, special offer, photo"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        autoComplete="off"
        aria-describedby={`${id}-status`}
      />
      <p id={`${id}-status`} className="sr-only" aria-live="polite">
        {typed ? (hits.length ? `${hits.length} matches.` : "No matches.") : ""}
      </p>
      {typed && (
        <div className="find-results">
          {hits.length ? (
            <ul>
              {hits.map((h) => (
                <li key={`${h.href}|${h.title}`}>
                  <a href={h.href}>
                    <strong>{h.title}</strong>
                    <span>{h.where}</span>
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="help">Nothing matched. Try another word, or click the part of the homepage you want to change below.</p>
          )}
        </div>
      )}
    </div>
  );
}
