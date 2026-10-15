"use client";

import { useEffect, useRef, useState } from "react";
import { isPhotoType, MAX_PHOTO_BYTES, mediaPathFor } from "@/lib/media";
import type { UploadMode } from "@/lib/media";

type Photo = { src: string; alt: string; credit: string };
type Props = {
  id: string;
  label: string;
  help?: string;
  value: Photo;
  onChange: (v: Photo) => void;
  errors: { src?: string; alt?: string };
  uploadMode: UploadMode;
};

async function uploadPhoto(file: File, mode: UploadMode): Promise<string> {
  if (!isPhotoType(file.type)) throw new Error("Use a JPG, PNG or WebP photo.");
  if (file.size > MAX_PHOTO_BYTES) throw new Error("That photo is over 8 MB. Use a smaller one, or export it at a lower size.");

  if (mode !== "local") {
    // Straight from the browser to the private Blob store; the server only hands out short-lived permission
    // (a client token, or a presigned URL when the store is connected with Vercel OIDC instead of a token).
    const { upload, uploadPresigned } = await import("@vercel/blob/client");
    const send = mode === "token" ? upload : uploadPresigned;
    const blob = await send(mediaPathFor(file.name, file.type), file, {
      access: "private",
      handleUploadUrl: "/api/admin/upload",
      contentType: file.type,
    });
    return `/${blob.pathname}`;
  }

  const body = new FormData();
  body.append("file", file);
  const res = await fetch("/api/admin/upload", { method: "POST", body });
  const json = (await res.json().catch(() => ({}))) as { pathname?: string; error?: string };
  if (!res.ok || !json.pathname) throw new Error(json.error ?? "The upload didn't work. Try again.");
  return `/${json.pathname}`;
}

export function PhotoField({ id, label, help, value, onChange, errors, uploadMode }: Props) {
  const input = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [problem, setProblem] = useState<string | null>(null);

  useEffect(() => () => void (preview && URL.revokeObjectURL(preview)), [preview]);

  async function onFile(file: File | undefined) {
    if (!file) return;
    setProblem(null);
    setBusy(true);
    try {
      const src = await uploadPhoto(file, uploadMode);
      setPreview(URL.createObjectURL(file));
      // A new upload replaces the placeholder, so the Unsplash credit goes away.
      onChange({ ...value, src, credit: "" });
    } catch (err) {
      setProblem(err instanceof Error ? err.message : "The upload didn't work. Try again.");
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  }

  const shown = preview ?? value.src;
  return (
    <fieldset className="group photo-field" id={id}>
      <legend>{label}</legend>
      {help && <p className="help">{help}</p>}
      <div className="photo-row">
        <div className="photo-preview">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={shown} alt="" />
          {preview && <span className="photo-badge">New, not saved yet</span>}
        </div>
        <div className="photo-controls">
          <input
            ref={input}
            id={`${id}-file`}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            onChange={(e) => onFile(e.target.files?.[0])}
          />
          <label htmlFor={`${id}-file`} className={busy ? "btn-admin secondary is-busy" : "btn-admin secondary"} aria-disabled={busy}>
            {busy ? "Uploading…" : "Choose a new photo"}
          </label>
          {value.credit ? (
            <p className="help">Placeholder photo by {value.credit}. Upload your own to replace it.</p>
          ) : (
            <p className="help">Your photo.</p>
          )}
          {(problem || errors.src) && (
            <p className="field-error" role="alert">
              {problem ?? errors.src}
            </p>
          )}
          <div className="field">
            <label htmlFor={`${id}-alt`}>Describe the photo</label>
            <p className="help" id={`${id}-alt-help`}>
              For people who can&apos;t see it, and for Google. For example: Drive-up units with blue doors.
            </p>
            <input
              id={`${id}-alt`}
              type="text"
              maxLength={160}
              value={value.alt}
              onChange={(e) => onChange({ ...value, alt: e.target.value })}
              aria-invalid={errors.alt ? true : undefined}
              aria-describedby={`${id}-alt-help`}
            />
            {errors.alt && (
              <p className="field-error" role="alert">
                {errors.alt}
              </p>
            )}
          </div>
        </div>
      </div>
    </fieldset>
  );
}
