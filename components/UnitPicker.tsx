"use client";

import { useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { site, units } from "@/lib/site";

export function UnitPicker() {
  const [index, setIndex] = useState(2);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const unit = units[index];

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const keys: Record<string, number> = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
    if (!(e.key in keys)) return;
    e.preventDefault();
    const next = (index + keys[e.key] + units.length) % units.length;
    setIndex(next);
    refs.current[next]?.focus();
  }

  return (
    <div className="picker">
      <div className="size-list" role="radiogroup" aria-label="Unit size" onKeyDown={onKeyDown}>
        {units.map((u, i) => (
          <button
            key={`${u.w}x${u.d}`}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="radio"
            aria-checked={i === index}
            tabIndex={i === index ? 0 : -1}
            className="size-option"
            onClick={() => setIndex(i)}
          >
            <span className="dims">
              {u.w}×{u.d}
            </span>
            <span className="name">{u.name}</span>
            <span className="sqft">{u.w * u.d} sq ft</span>
          </button>
        ))}
      </div>

      <div className="plan-panel" aria-live="polite">
        <div className="blueprint">
          <div className="footprint" style={{ "--w": unit.w, "--d": unit.d } as CSSProperties}>
            <span className="dim dim-w">{unit.w} ft</span>
            <span className="dim dim-d">{unit.d} ft</span>
            <span className="door-label">Roll-up door</span>
          </div>
          <span className="scale-note">1 square = 1 ft</span>
        </div>
        <div className="plan-info">
          <div>
            <h3>
              {unit.w}×{unit.d} {unit.name.toLowerCase()} unit
            </h3>
            <p>
              {unit.w * unit.d} sq ft. {unit.use}
            </p>
          </div>
          <a className="btn btn-blue" href={site.reserveUrl}>
            Reserve this size
          </a>
        </div>
      </div>
    </div>
  );
}
