"use client";

// Renders a screen's fields (see screen-fields.ts) as a plain, labelled form. Field ids are the full content path
// (f-home-hero-headline), so search results and task links can point straight at a field.
import { useEffect, useState } from "react";
import { DAYS } from "@/lib/format";
import type { UploadMode } from "@/lib/media";
import type { Field } from "./screen-fields";
import { PhotoField } from "./PhotoField";

type Path = (string | number)[];
type Ctx = {
  errors: Record<string, string>;
  onChange: (path: Path, value: unknown) => void;
  uploadMode: UploadMode;
  /** The value at a path as last saved, to tell new from saved (for example a just-uploaded photo). */
  savedAt?: (path: Path) => unknown;
};

const idFor = (path: Path) => `f-${path.join("-")}`;
const keyOf = (path: Path) => path.join(".");

function Help({ id, text }: { id: string; text?: string }) {
  return text ? (
    <p className="help" id={id}>
      {text}
    </p>
  ) : null;
}

function ErrorText({ id, text }: { id: string; text?: string }) {
  return text ? (
    <p className="field-error" id={id} role="alert">
      {text}
    </p>
  ) : null;
}

function describedBy(id: string, help?: string, error?: string) {
  return [help && `${id}-help`, error && `${id}-error`].filter(Boolean).join(" ") || undefined;
}

const SHORT = new Set<Field["kind"]>(["number", "date", "time", "select"]);
const isBlock = (f: Field) => ["group", "list", "strings", "photo", "week", "unitTable"].includes(f.kind);

/** Browsers without CSS field-sizing: size the growing box to its text on every render. */
function growFallback(el: HTMLTextAreaElement | null) {
  if (!el || CSS.supports("field-sizing", "content")) return;
  el.style.height = "auto";
  el.style.height = `${el.scrollHeight + 2}px`;
}

/** "rapidselfstorage.com/x" → "https://rapidselfstorage.com/x", so a pasted address without https:// still works. */
function withScheme(v: string): string {
  const t = v.trim();
  return /^[a-z0-9-]+(\.[a-z0-9-]+)+(\/\S*)?$/i.test(t) ? `https://${t}` : v;
}

/**
 * Renders fields on a two-column grid (short inputs share a row). At the top level of a screen, runs of plain
 * fields are wrapped in a card so they match the grouped sections.
 */
export function Fields({ fields, value, path, ctx, top = false }: { fields: Field[]; value: Record<string, unknown>; path: Path; ctx: Ctx; top?: boolean }) {
  const render = (f: Field, i: number) => {
    if (f.kind === "group") {
      const groupPath = f.key ? [...path, f.key] : path;
      const groupValue = (f.key ? value[f.key] : value) as Record<string, unknown>;
      return (
        <fieldset key={f.key ?? `g${i}`} className="group cell wide" id={idFor(groupPath.length ? groupPath : [`g${i}`])}>
          <legend>{f.label}</legend>
          {f.help && <p className="help">{f.help}</p>}
          <Fields fields={f.fields} value={groupValue} path={groupPath} ctx={ctx} />
        </fieldset>
      );
    }
    return (
      <div key={f.key} className={SHORT.has(f.kind) ? "cell" : "cell wide"}>
        <FieldView field={f} value={value[f.key]} path={[...path, f.key]} ctx={ctx} />
      </div>
    );
  };

  if (!top) return <div className="field-grid">{fields.map(render)}</div>;

  const chunks: Field[][] = [];
  for (const f of fields) {
    const last = chunks[chunks.length - 1];
    if (!isBlock(f) && last && !isBlock(last[0])) last.push(f);
    else chunks.push([f]);
  }
  return (
    <>
      {chunks.map((chunk, i) =>
        isBlock(chunk[0]) ? (
          render(chunk[0], i)
        ) : (
          <div key={`run${i}`} className="group">
            <div className="field-grid">{chunk.map(render)}</div>
          </div>
        ),
      )}
    </>
  );
}

function FieldView({ field: f, value, path, ctx }: { field: Exclude<Field, { kind: "group" }>; value: unknown; path: Path; ctx: Ctx }) {
  const id = idFor(path);
  const error = ctx.errors[keyOf(path)];
  const set = (v: unknown) => ctx.onChange(path, v);
  const aria = { "aria-invalid": error ? true : undefined, "aria-describedby": describedBy(id, "help" in f ? f.help : undefined, error) };

  switch (f.kind) {
    case "text":
      return (
        <div className="field">
          <label htmlFor={id}>{f.label}</label>
          <Help id={`${id}-help`} text={f.help} />
          {f.multiline ? (
            <textarea id={id} value={String(value ?? "")} maxLength={f.max} rows={3} onChange={(e) => set(e.target.value)} {...aria} />
          ) : f.max >= 60 && !f.inputType ? (
            // A sentence-long line: a box that grows to show all of it (phones cut a one-line box off), where Enter doesn't add a line break.
            <textarea
              id={id}
              className="grow"
              ref={growFallback}
              value={String(value ?? "")}
              maxLength={f.max}
              rows={1}
              onChange={(e) => set(e.target.value.replace(/\s*\n\s*/g, " "))}
              onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
              {...aria}
            />
          ) : (
            <input
              id={id}
              type={f.inputType ?? "text"}
              value={String(value ?? "")}
              maxLength={f.max}
              placeholder={f.placeholder}
              onChange={(e) => set(e.target.value)}
              onBlur={f.inputType === "url" ? (e) => e.target.value !== withScheme(e.target.value) && set(withScheme(e.target.value)) : undefined}
              {...aria}
            />
          )}
          <ErrorText id={`${id}-error`} text={error} />
        </div>
      );
    case "number":
      return (
        <div className="field">
          <label htmlFor={id}>{f.label}</label>
          <Help id={`${id}-help`} text={f.help} />
          <div className="input-row">
            {f.prefix && <span className="adorn">{f.prefix}</span>}
            <input
              id={id}
              type="number"
              inputMode="numeric"
              min={0}
              step={1}
              className="input-number"
              value={value === null || value === undefined || Number.isNaN(value) ? "" : String(value)}
              onChange={(e) => set(e.target.value === "" ? (f.nullable ? null : Number.NaN) : Number(e.target.value))}
              {...aria}
            />
            {f.suffix && <span className="adorn">{f.suffix}</span>}
          </div>
          <ErrorText id={`${id}-error`} text={error} />
        </div>
      );
    case "toggle":
      return (
        <div className="field">
          <label className="toggle" htmlFor={id}>
            <input id={id} type="checkbox" role="switch" checked={Boolean(value)} onChange={(e) => set(e.target.checked)} {...aria} />
            <span className="toggle-track" aria-hidden="true" />
            <span>{f.label}</span>
          </label>
          <Help id={`${id}-help`} text={f.help} />
          <ErrorText id={`${id}-error`} text={error} />
        </div>
      );
    case "date":
    case "time":
      return (
        <div className="field field-inline">
          <label htmlFor={id}>{f.label}</label>
          <Help id={`${id}-help`} text={f.help} />
          <div className="input-row">
            <input id={id} type={f.kind} value={String(value ?? "")} onChange={(e) => set(e.target.value)} {...aria} />
            {f.kind === "date" && value ? (
              <button type="button" className="link-btn" onClick={() => set("")}>
                Clear
              </button>
            ) : null}
          </div>
          <ErrorText id={`${id}-error`} text={error} />
        </div>
      );
    case "select":
      return (
        <div className="field field-inline">
          <label htmlFor={id}>{f.label}</label>
          <Help id={`${id}-help`} text={f.help} />
          <select id={id} value={String(value ?? "")} onChange={(e) => set(f.numeric ? Number(e.target.value) : e.target.value)} {...aria}>
            {f.options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <ErrorText id={`${id}-error`} text={error} />
        </div>
      );
    case "photo":
      return (
        <PhotoField
          id={id}
          label={f.label}
          help={f.help}
          value={value as { src: string; alt: string; credit: string }}
          onChange={set}
          errors={{ src: ctx.errors[`${keyOf(path)}.src`], alt: ctx.errors[`${keyOf(path)}.alt`] }}
          uploadMode={ctx.uploadMode}
          savedSrc={(ctx.savedAt?.(path) as { src?: string } | undefined)?.src}
        />
      );
    case "week":
      return <WeekField id={id} label={f.label} help={f.help} value={value as Day[]} path={path} ctx={ctx} />;
    case "list":
      return <ListField field={f} value={(value as Record<string, unknown>[]) ?? []} path={path} ctx={ctx} />;
    case "strings":
      return <StringsField field={f} value={(value as string[]) ?? []} path={path} ctx={ctx} />;
    case "unitTable":
      return <UnitTable field={f} value={(value as UnitRow[]) ?? []} path={path} ctx={ctx} />;
  }
}

// ---- Lists ----

function move<T>(arr: T[], from: number, to: number): T[] {
  const copy = [...arr];
  const [item] = copy.splice(from, 1);
  copy.splice(to, 0, item);
  return copy;
}

/** Remove button that asks for confirmation in the page itself. */
function RemoveButton({ what, onConfirm }: { what: string; onConfirm: () => void }) {
  const [asking, setAsking] = useState(false);
  if (!asking) {
    return (
      <button type="button" className="mini-btn danger" onClick={() => setAsking(true)}>
        Remove
      </button>
    );
  }
  return (
    <span className="confirm" role="group" aria-label={`Remove this ${what}?`}>
      <span>Remove this {what}?</span>
      <button
        type="button"
        className="mini-btn danger solid"
        onClick={() => {
          setAsking(false);
          onConfirm();
        }}
      >
        Yes, remove
      </button>
      <button type="button" className="mini-btn" onClick={() => setAsking(false)} autoFocus>
        Cancel
      </button>
    </span>
  );
}

function ItemTools({ index, count, what, onMove, onRemove }: { index: number; count: number; what: string; onMove: (to: number) => void; onRemove: () => void }) {
  return (
    <div className="item-tools">
      <button type="button" className="mini-btn" disabled={index === 0} onClick={() => onMove(index - 1)} aria-label={`Move this ${what} up`}>
        ↑ Up
      </button>
      <button type="button" className="mini-btn" disabled={index === count - 1} onClick={() => onMove(index + 1)} aria-label={`Move this ${what} down`}>
        ↓ Down
      </button>
      <RemoveButton what={what} onConfirm={onRemove} />
    </div>
  );
}

function ListField({ field: f, value, path, ctx }: { field: Extract<Field, { kind: "list" }>; value: Record<string, unknown>[]; path: Path; ctx: Ctx }) {
  const error = ctx.errors[keyOf(path)];
  const full = f.max !== undefined && value.length >= f.max;
  const keyFor = (item: Record<string, unknown>, i: number) => String(item.id ?? i);
  // Long lists start folded, so the page shows every item's name at a glance. New items and items with a
  // problem open by themselves.
  const [opened, setOpened] = useState<Set<string>>(() => new Set());
  const isOpen = (item: Record<string, unknown>, i: number) =>
    !f.collapse || opened.has(keyFor(item, i)) || Object.keys(ctx.errors).some((k) => k.startsWith(`${keyOf([...path, i])}.`));
  // A link to a field inside a folded item (from search or "Check text you typed elsewhere") opens that item.
  useEffect(() => {
    if (!f.collapse) return;
    const prefix = `${idFor(path)}-`;
    const hash = decodeURIComponent(location.hash.slice(1));
    if (!hash.startsWith(prefix)) return;
    const i = Number(hash.slice(prefix.length).split("-")[0]);
    if (Number.isInteger(i) && value[i]) setOpened((prev) => new Set(prev).add(keyFor(value[i], i)));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps -- only on arrival

  const toggle = (k: string) =>
    setOpened((prev) => {
      const next = new Set(prev);
      if (next.has(k)) next.delete(k);
      else next.add(k);
      return next;
    });

  return (
    <div className="list" id={idFor(path)}>
      <div className="list-head">
        <h3>{f.label}</h3>
        {f.help && <p className="help">{f.help}</p>}
        <ErrorText id={`${idFor(path)}-error`} text={error} />
      </div>
      <ol className="list-items">
        {value.map((item, i) => {
          const k = keyFor(item, i);
          const open = isOpen(item, i);
          const bodyId = `${idFor([...path, i])}-body`;
          return (
            <li key={k} className={open ? "list-item" : "list-item is-folded"}>
              <div className="list-item-head">
                {f.collapse ? (
                  <button type="button" className="item-toggle" aria-expanded={open} aria-controls={bodyId} onClick={() => toggle(k)}>
                    <span className="chev" aria-hidden="true" />
                    <strong>{f.itemTitle(item, i)}</strong>
                    <span className="item-toggle-hint">{open ? "Close" : "Edit"}</span>
                  </button>
                ) : (
                  <strong>{f.itemTitle(item, i)}</strong>
                )}
                {!f.fixed && (
                  <ItemTools
                    index={i}
                    count={value.length}
                    what={f.itemName}
                    onMove={(to) => ctx.onChange(path, move(value, i, to))}
                    onRemove={() => ctx.onChange(path, value.filter((_, j) => j !== i))}
                  />
                )}
              </div>
              {open && (
                <div className="list-item-body" id={bodyId}>
                  <Fields fields={f.fields} value={item} path={[...path, i]} ctx={ctx} />
                </div>
              )}
            </li>
          );
        })}
      </ol>
      {!f.fixed && f.newItem && (
        <button
          type="button"
          className="btn-admin secondary"
          disabled={full}
          onClick={() => {
            const item = f.newItem!();
            setOpened((prev) => new Set(prev).add(keyFor(item, value.length)));
            ctx.onChange(path, [...value, item]);
          }}
        >
          + Add {/^[aeiou]/.test(f.itemName) ? "an" : "a"} {f.itemName}
        </button>
      )}
    </div>
  );
}

// ---- Prices at a glance (unit sizes) ----

type UnitRow = { id: string; width: number; depth: number; name: string; price: number | null; soldOut: boolean };

function UnitTable({ field: f, value, path, ctx }: { field: Extract<Field, { kind: "unitTable" }>; value: UnitRow[]; path: Path; ctx: Ctx }) {
  const set = (i: number, patch: Partial<UnitRow>) => ctx.onChange(path, value.map((u, j) => (j === i ? { ...u, ...patch } : u)));
  return (
    <div className="unit-table-wrap" id={`${idFor(path)}-table`}>
      {f.help && <p className="help">{f.help}</p>}
      <table className="unit-table">
        <thead>
          <tr>
            <th scope="col">Size</th>
            <th scope="col">Monthly price</th>
            <th scope="col">Sold out</th>
          </tr>
        </thead>
        <tbody>
          {value.map((u, i) => {
            const size = `${u.width}×${u.depth}${u.name ? ` ${u.name}` : ""}`;
            const priceId = `${idFor([...path, i, "price"])}-quick`;
            const err = ctx.errors[keyOf([...path, i, "price"])];
            return (
              <tr key={u.id} className={u.soldOut ? "is-sold-out" : undefined}>
                <th scope="row">{size}</th>
                <td>
                  <div className="input-row">
                    <span className="adorn">$</span>
                    <input
                      id={priceId}
                      type="number"
                      inputMode="numeric"
                      min={0}
                      step={1}
                      className="input-number"
                      placeholder="Call"
                      value={u.price === null || Number.isNaN(u.price) ? "" : String(u.price)}
                      onChange={(e) => set(i, { price: e.target.value === "" ? null : Number(e.target.value) })}
                      aria-label={`${size}: monthly price in dollars`}
                      aria-invalid={err ? true : undefined}
                    />
                  </div>
                  {err && <p className="field-error">{err}</p>}
                </td>
                <td>
                  <label className="toggle">
                    <input type="checkbox" role="switch" checked={u.soldOut} onChange={(e) => set(i, { soldOut: e.target.checked })} aria-label={`${size}: sold out`} />
                    <span className="toggle-track" aria-hidden="true" />
                  </label>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function StringsField({ field: f, value, path, ctx }: { field: Extract<Field, { kind: "strings" }>; value: string[]; path: Path; ctx: Ctx }) {
  const error = ctx.errors[keyOf(path)];
  return (
    <div className="list" id={idFor(path)}>
      <div className="list-head">
        <h3>{f.label}</h3>
        {f.help && <p className="help">{f.help}</p>}
        <ErrorText id={`${idFor(path)}-error`} text={error} />
      </div>
      <ol className="list-items">
        {value.map((item, i) => {
          const id = idFor([...path, i]);
          const itemError = ctx.errors[keyOf([...path, i])];
          const set = (v: string) => ctx.onChange(path, value.map((x, j) => (j === i ? v : x)));
          return (
            <li key={i} className="list-item compact">
              <label className="sr-only" htmlFor={id}>
                {f.itemName} {i + 1}
              </label>
              {f.multiline ? (
                <textarea id={id} value={item} maxLength={f.maxLength} rows={4} onChange={(e) => set(e.target.value)} aria-invalid={itemError ? true : undefined} />
              ) : (
                <input id={id} type={f.inputType ?? "text"} value={item} maxLength={f.maxLength} onChange={(e) => set(e.target.value)} aria-invalid={itemError ? true : undefined} />
              )}
              <ErrorText id={`${id}-error`} text={itemError} />
              <ItemTools
                index={i}
                count={value.length}
                what={f.itemName}
                onMove={(to) => ctx.onChange(path, move(value, i, to))}
                onRemove={() => ctx.onChange(path, value.filter((_, j) => j !== i))}
              />
            </li>
          );
        })}
      </ol>
      <button type="button" className="btn-admin secondary" disabled={value.length >= f.max} onClick={() => ctx.onChange(path, [...value, ""])}>
        + Add {/^[aeiou]/.test(f.itemName) ? "an" : "a"} {f.itemName}
      </button>
    </div>
  );
}

// ---- Office hours ----

type Day = { open: boolean; opens: string; closes: string };

function WeekField({ id, label, help, value, path, ctx }: { id: string; label: string; help?: string; value: Day[]; path: Path; ctx: Ctx }) {
  const setDay = (i: number, patch: Partial<Day>) => ctx.onChange(path, value.map((d, j) => (j === i ? { ...d, ...patch } : d)));
  return (
    <fieldset className="group" id={id}>
      <legend>{label}</legend>
      {help && <p className="help">{help}</p>}
      <table className="week">
        <thead>
          <tr>
            <th scope="col">Day</th>
            <th scope="col">Open</th>
            <th scope="col">Opens</th>
            <th scope="col">Closes</th>
          </tr>
        </thead>
        <tbody>
          {value.map((d, i) => {
            const err = ctx.errors[keyOf([...path, i, "closes"])];
            return (
              <tr key={DAYS[i]}>
                <th scope="row">{DAYS[i]}</th>
                <td>
                  <label className="toggle">
                    <input type="checkbox" role="switch" checked={d.open} onChange={(e) => setDay(i, { open: e.target.checked })} aria-label={`Open on ${DAYS[i]}`} />
                    <span className="toggle-track" aria-hidden="true" />
                  </label>
                </td>
                {d.open ? (
                  <>
                    <td>
                      <input type="time" value={d.opens} onChange={(e) => setDay(i, { opens: e.target.value })} aria-label={`${DAYS[i]} opens`} />
                    </td>
                    <td>
                      <input type="time" value={d.closes} onChange={(e) => setDay(i, { closes: e.target.value })} aria-label={`${DAYS[i]} closes`} aria-invalid={err ? true : undefined} />
                      {err && <p className="field-error">{err}</p>}
                    </td>
                  </>
                ) : (
                  <td colSpan={2} className="closed">
                    Closed
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </fieldset>
  );
}
