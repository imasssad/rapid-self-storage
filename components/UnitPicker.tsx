"use client";

import { useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import type { ContactInfo, SiteButton as Button, Unit } from "@/lib/content-schema";
import { formatPrice } from "@/lib/format";
import { Icon } from "./Icon";
import { SiteButton } from "./SiteButton";

type Props = { items: Unit[]; button: Button; soldOutButton: Button; contact: ContactInfo };

export function UnitPicker({ items, button, soldOutButton, contact }: Props) {
  const [index, setIndex] = useState(Math.min(2, items.length - 1));
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const unit = items[index];

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const keys: Record<string, number> = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
    if (!(e.key in keys)) return;
    e.preventDefault();
    const next = (index + keys[e.key] + items.length) % items.length;
    setIndex(next);
    refs.current[next]?.focus();
  }

  return (
    <div className="picker">
      <div className="size-list" role="radiogroup" aria-label="Unit size" onKeyDown={onKeyDown}>
        {items.map((u, i) => (
          <button
            key={u.id}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="radio"
            aria-checked={i === index}
            tabIndex={i === index ? 0 : -1}
            className={u.soldOut ? "size-option is-sold-out" : "size-option"}
            onClick={() => setIndex(i)}
          >
            <span className="dims">
              {u.width}×{u.depth}
            </span>
            <span className="name">
              {u.name}
              {u.soldOut ? (
                <span className="size-tag">Sold out</span>
              ) : (
                u.price !== null && <span className="size-price">{formatPrice(u.price)}/mo</span>
              )}
            </span>
            <span className="sqft">{u.width * u.depth} sq ft</span>
            <span className="tick" aria-hidden="true">
              <Icon name="check" className="icon-xs" />
            </span>
          </button>
        ))}
      </div>

      <div className={unit.soldOut ? "plan-panel is-sold-out" : "plan-panel"} aria-live="polite">
        <div className="blueprint">
          <div className="footprint" style={{ "--w": unit.width, "--d": unit.depth } as CSSProperties}>
            <span className="dim dim-w">{unit.width} ft</span>
            <span className="dim dim-d">{unit.depth} ft</span>
            <span className="door-label">Roll-up door</span>
          </div>
          <span className="scale-note">1 square = 1 ft</span>
        </div>
        <div className="plan-info" key={unit.id}>
          <div>
            <p className="plan-size">
              {unit.width}×{unit.depth}
              <span>{unit.width * unit.depth} sq ft</span>
            </p>
            <h3>{unit.name} unit</h3>
            {unit.description && <p>{unit.description}</p>}
            <p className="plan-price">
              {unit.soldOut ? (
                <span className="size-tag">Sold out</span>
              ) : unit.price !== null ? (
                <>
                  <strong>{formatPrice(unit.price)}</strong> per month
                </>
              ) : (
                "Call for price"
              )}
            </p>
          </div>
          {unit.soldOut ? (
            <SiteButton button={soldOutButton} contact={contact} className="btn btn-outline" />
          ) : (
            <SiteButton button={button} contact={contact} className="btn btn-blue" arrow />
          )}
        </div>
      </div>
    </div>
  );
}
