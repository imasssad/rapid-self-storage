"use client";

import { useEffect, useState } from "react";
import { saveSection } from "@/app/admin/actions";
import { fieldErrors, sectionSchemas, type SectionKey } from "@/lib/content-schema";
import { Fields } from "./fields";
import { sectionConfigs } from "./sections";

type Status = { kind: "idle" } | { kind: "saving" } | { kind: "saved" } | { kind: "error"; message: string };

function setAt(obj: unknown, path: (string | number)[], value: unknown): unknown {
  if (!path.length) return value;
  const [k, ...rest] = path;
  const copy = (Array.isArray(obj) ? [...obj] : { ...(obj as object) }) as Record<string | number, unknown>;
  copy[k] = setAt((obj as Record<string | number, unknown>)?.[k], rest, value);
  return copy;
}

export function SectionEditor({ section, initial, storageMode }: { section: SectionKey; initial: unknown; storageMode: "blob" | "local" }) {
  const config = sectionConfigs[section];
  const [saved, setSaved] = useState(initial);
  const [value, setValue] = useState(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const dirty = JSON.stringify(value) !== JSON.stringify(saved);

  // Warn before leaving with unsaved changes (the admin menu uses normal links, so this covers it too).
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  function onChange(path: (string | number)[], v: unknown) {
    setValue((prev: unknown) => setAt(prev, path, v));
    if (status.kind !== "saving") setStatus({ kind: "idle" });
  }

  function showErrors(errs: Record<string, string>, message: string) {
    setErrors(errs);
    setStatus({ kind: "error", message });
    requestAnimationFrame(() => document.querySelector<HTMLElement>("[aria-invalid='true'], .field-error")?.scrollIntoView({ block: "center", behavior: "smooth" }));
  }

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    const parsed = sectionSchemas[section].safeParse(value);
    if (!parsed.success) return showErrors(fieldErrors(parsed.error), "Some fields need attention. They're marked in red.");
    setStatus({ kind: "saving" });
    const res = await saveSection(section, parsed.data);
    if (!res.ok) return showErrors(res.fieldErrors ?? {}, res.error);
    setErrors({});
    setSaved(parsed.data);
    setValue(parsed.data);
    setStatus({ kind: "saved" });
  }

  return (
    <form className="editor" onSubmit={onSave} noValidate>
      <header className="page-head">
        <h1>{config.title}</h1>
        <p className="lede-admin">{config.intro}</p>
      </header>

      {status.kind === "error" && (
        <div className="notice error" role="alert">
          {status.message}
        </div>
      )}

      <Fields top fields={config.fields} value={value as Record<string, unknown>} path={[]} ctx={{ errors, onChange, storageMode }} />

      <div className="save-bar">
        <button type="submit" className="btn-admin primary" disabled={!dirty || status.kind === "saving"}>
          {status.kind === "saving" ? "Saving…" : "Save changes"}
        </button>
        <p className="save-status" role="status" aria-live="polite">
          {status.kind === "saved" && !dirty ? (
            <>
              <span className="ok">Saved. Your website is updated.</span>{" "}
              <a href="/" target="_blank" rel="noopener">
                View website
              </a>
            </>
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
