"use client";

// One admin screen: the fields for one part of the website on the left, a live preview of that part on the right.
// The draft is the whole site content (the preview needs it), but only this screen's parts are saved.
import { useEffect, useMemo, useRef, useState } from "react";
import { saveScreen } from "@/app/admin/actions";
import { fieldErrors, sectionSchemas, type SectionKey, type SiteContent } from "@/lib/content-schema";
import type { UploadMode } from "@/lib/media";
import { getAt, screens, setAt, type ScreenKey } from "@/lib/screens";
import { Fields } from "./fields";
import { PreviewFrame, type Device } from "./PreviewFrame";
import { screenBlocks } from "./screen-fields";
import { Mentions } from "./Mentions";
import { visibilityNote } from "./visibility";

type Status =
  | { kind: "idle" }
  | { kind: "saving" }
  | { kind: "saved" }
  | { kind: "undone" }
  | { kind: "error"; message: string }
  | { kind: "conflict"; message: string };

export function ScreenEditor({ screen, content, uploadMode }: { screen: ScreenKey; content: SiteContent; uploadMode: UploadMode }) {
  const def = screens[screen];
  const blocks = screenBlocks[screen];
  const hasPreview = screen !== "settings";
  const [saved, setSaved] = useState(content);
  const [draft, setDraft] = useState(content);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [device, setDevice] = useState<Device>("computer");
  const [showPreview, setShowPreview] = useState(true);
  // What was stored just before the last save, for "Undo this save".
  const [before, setBefore] = useState<unknown[] | null>(null);
  const statusRef = useRef<HTMLParagraphElement>(null);
  const conflictRef = useRef<HTMLDivElement>(null);
  // Set when the person chose to drop their changes, so the browser doesn't ask "Leave site?" as well.
  const leaving = useRef(false);

  const scoped = (c: SiteContent) => JSON.stringify(def.scopes.map((p) => getAt(c, p)));
  const dirty = useMemo(() => scoped(draft) !== scoped(saved), [draft, saved]); // eslint-disable-line react-hooks/exhaustive-deps -- scopes are fixed per screen
  const note = visibilityNote(screen, draft);

  // Warn before leaving with unsaved changes (the admin menu uses normal links, so this covers it too).
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => {
      if (leaving.current) return;
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  // Arriving from search or a task link (#f-…): bring that field into view and put the cursor in it.
  useEffect(() => {
    const id = decodeURIComponent(location.hash.slice(1));
    if (!id) return;
    // After folded list items have opened (see ListField).
    const t = setTimeout(() => {
      const el = document.getElementById(id);
      if (!el) return;
      el.scrollIntoView({ block: "center" });
      el.classList.add("is-target");
      const control = el.matches("input, textarea, select")
        ? el
        : el.querySelector<HTMLElement>("input:not([type=file]):not([type=checkbox]), textarea, select, button");
      control?.focus({ preventScroll: true });
    }, 60);
    return () => clearTimeout(t);
  }, []);

  // A conflict is reported above the form: bring it into view and put focus on its main choice.
  useEffect(() => {
    if (status.kind !== "conflict") return;
    conflictRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
    conflictRef.current?.querySelector<HTMLButtonElement>("button.primary")?.focus({ preventScroll: true });
  }, [status.kind]);

  // Phones get the phone-sized preview by default.
  useEffect(() => {
    if (window.matchMedia("(max-width: 700px)").matches) setDevice("phone");
  }, []);

  function onChange(path: (string | number)[], v: unknown) {
    setDraft((prev) => setAt(prev, path, v));
    if (status.kind !== "saving") setStatus({ kind: "idle" });
  }

  function showErrors(errs: Record<string, string>, message: string) {
    setErrors(errs);
    setStatus({ kind: "error", message });
    requestAnimationFrame(() =>
      document.querySelector<HTMLElement>(".editor-form [aria-invalid='true'], .editor-form .field-error")?.scrollIntoView({ block: "center", behavior: "smooth" }),
    );
  }

  const valuesOf = (c: SiteContent) => def.scopes.map((p) => getAt(c, p));

  async function save(force = false) {
    if (status.kind === "saving") return;
    // Check the parts of the website this screen changes, with the same rules the server uses.
    let clean = draft;
    const errs: Record<string, string> = {};
    for (const key of new Set(def.scopes.map((p) => p[0] as SectionKey))) {
      const parsed = sectionSchemas[key].safeParse(draft[key]);
      if (parsed.success) clean = { ...clean, [key]: parsed.data };
      else for (const [k, v] of Object.entries(fieldErrors(parsed.error))) errs[k ? `${key}.${k}` : key] = v;
    }
    if (Object.keys(errs).length) return showErrors(errs, "Not saved yet: some fields need attention. They're marked in red.");

    setStatus({ kind: "saving" });
    const res = await saveScreen(screen, valuesOf(clean), valuesOf(saved), force);
    if (!res.ok) {
      if (res.conflict) return setStatus({ kind: "conflict", message: res.error });
      return showErrors(res.fieldErrors ?? {}, res.error);
    }
    const stored = def.scopes.reduce((c, p, i) => setAt(c, p, res.values[i]), clean);
    setBefore(res.previous);
    setErrors({});
    setSaved(stored);
    setDraft(stored);
    setStatus({ kind: "saved" });
  }

  async function undoSave() {
    if (!before || status.kind === "saving") return;
    setStatus({ kind: "saving" });
    const res = await saveScreen(screen, before, valuesOf(saved));
    if (!res.ok) return setStatus({ kind: "error", message: res.conflict ? `Can't undo: ${res.error}` : res.error });
    const restored = def.scopes.reduce((c, p, i) => setAt(c, p, res.values[i]), saved);
    setBefore(null);
    setSaved(restored);
    setDraft(restored);
    setStatus({ kind: "undone" });
    statusRef.current?.focus();
  }

  function onSave(e: React.FormEvent) {
    e.preventDefault();
    void save();
  }

  const ctx = { errors, onChange, uploadMode, savedAt: (path: (string | number)[]) => getAt(saved, path) };
  const groupLabel = def.group === "page" ? "Your homepage" : def.group === "business" ? "Business details" : "Tools";

  return (
    <form className={hasPreview ? "editor screen-editor" : "editor"} onSubmit={onSave} noValidate>
      <header className="page-head">
        <p className="crumbs">
          <a href="/admin">Start</a> <span aria-hidden="true">›</span> {groupLabel}
        </p>
        <h1>{def.title}</h1>
        <p className="lede-admin">{def.blurb}</p>
        {def.note && (
          <p className="good-to-know">
            <strong>Good to know:</strong> {def.note}
          </p>
        )}
        {def.anchor && (
          <p>
            <a className="see-live" href={`/#${def.anchor}`} target="_blank" rel="noopener">
              See this on the website ↗
            </a>
          </p>
        )}
      </header>

      <div className={hasPreview ? "editor-cols" : undefined}>
        <div className="editor-form">
          {status.kind === "error" && (
            <div className="notice error" role="alert">
              {status.message}
            </div>
          )}
          {status.kind === "conflict" && (
            <div ref={conflictRef} className="notice error" role="alert">
              <p>{status.message}</p>
              <p className="notice-actions">
                <button
                  type="button"
                  className="btn-admin secondary"
                  onClick={() => {
                    leaving.current = true;
                    location.reload();
                  }}
                >
                  Show their version (drops my changes)
                </button>
                <button type="button" className="btn-admin primary" onClick={() => void save(true)}>
                  Save mine anyway
                </button>
              </p>
            </div>
          )}
          {blocks.map((block, i) => {
            const value = getAt(draft, block.path) as Record<string, unknown>;
            if (!block.title) return <Fields key={i} top fields={block.fields} value={value} path={block.path} ctx={ctx} />;
            const id = `block-${screen}-${i}`;
            return (
              <section key={i} className="group" aria-labelledby={id}>
                <h2 id={id}>{block.title}</h2>
                {block.help && <p className="help">{block.help}</p>}
                <Fields fields={block.fields} value={value} path={block.path} ctx={ctx} />
              </section>
            );
          })}
          {screen === "contact" && <Mentions content={draft} />}
        </div>

        {hasPreview && (
          <aside className="editor-preview" aria-label="Preview">
            <div className="preview-head">
              <div>
                <h2>Preview</h2>
                <p className="help">Updates as you type. Visitors see it only after you save.</p>
              </div>
              <div className="preview-tools">
                <div className="segmented" role="group" aria-label="Preview size">
                  {(["computer", "phone"] as const).map((d) => (
                    <button key={d} type="button" aria-pressed={device === d} onClick={() => setDevice(d)}>
                      {d === "computer" ? "Computer" : "Phone"}
                    </button>
                  ))}
                </div>
                <button type="button" className="link-btn preview-toggle" aria-expanded={showPreview} onClick={() => setShowPreview((s) => !s)}>
                  {showPreview ? "Hide" : "Show"}
                </button>
              </div>
            </div>
            {note && <p className={note.ok ? "preview-status ok" : "preview-status"}>{note.text}</p>}
            {showPreview && <PreviewFrame target={screen} content={draft} device={device} title={`Preview of ${def.title}`} />}
          </aside>
        )}
      </div>

      <div className="save-bar">
        <button type="submit" className="btn-admin primary" aria-disabled={!dirty || status.kind === "saving"} disabled={!dirty}>
          {status.kind === "saving" ? "Saving…" : "Save changes"}
        </button>
        {dirty && status.kind !== "saving" && (
          <button
            type="button"
            className="btn-admin secondary"
            onClick={() => {
              setDraft(saved);
              setErrors({});
              setStatus({ kind: "idle" });
              statusRef.current?.focus();
            }}
          >
            Undo my changes
          </button>
        )}
        {/* Focus lands here after an undo removes the button that was pressed. */}
        <p ref={statusRef} className="save-status" role="status" aria-live="polite" tabIndex={-1}>
          {status.kind === "saved" && !dirty ? (
            <>
              <span className="ok">Saved. Your website is updated.</span>{" "}
              <a href={def.anchor ? `/#${def.anchor}` : "/"} target="_blank" rel="noopener">
                View it on the website ↗
              </a>
              {before && (
                <>
                  {" · "}
                  <button type="button" className="link-btn" onClick={() => void undoSave()}>
                    Undo this save
                  </button>
                </>
              )}
            </>
          ) : status.kind === "undone" && !dirty ? (
            <span className="ok">Undone. This part of the website is back to how it was.</span>
          ) : status.kind === "error" || status.kind === "conflict" ? (
            <span className="bad">Not saved. See the message above.</span>
          ) : dirty ? (
            "You have unsaved changes."
          ) : (
            "No changes yet."
          )}
        </p>
      </div>
    </form>
  );
}
