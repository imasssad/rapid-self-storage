"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { restoreVersion, undoChange } from "@/app/admin/actions";

export type HistoryRow = { id: string; when: string; who: string; what: string; details: string; canUndo: boolean };
type Asking = { id: string; kind: "undo" | "restore" } | null;

export function HistoryList({ rows }: { rows: HistoryRow[] }) {
  const router = useRouter();
  const [asking, setAsking] = useState<Asking>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ ok: boolean; text: string } | null>(null);

  async function run(id: string, kind: "undo" | "restore") {
    setBusy(id);
    setAsking(null);
    const res = kind === "undo" ? await undoChange(id) : await restoreVersion(id);
    setBusy(null);
    setNotice(res.ok ? { ok: true, text: res.message ?? "Done. Your website is updated." } : { ok: false, text: res.error });
    if (res.ok) router.refresh();
  }

  if (!rows.length) return <p className="empty">No saved versions yet. Each time you save, a version appears here.</p>;
  return (
    <>
      {notice && (
        <div className={notice.ok ? "notice ok" : "notice error"} role="status">
          {notice.text}{" "}
          {notice.ok && (
            <a href="/" target="_blank" rel="noopener">
              View website
            </a>
          )}
        </div>
      )}
      <ol className="history">
        {rows.map((r, i) => (
          <li key={r.id}>
            <div>
              <strong>
                {r.what}
                {i === 0 && <span className="current">Current version</span>}
              </strong>
              {r.details && <span className="history-details">{r.details}</span>}
              <span>
                {r.who} · {r.when}
              </span>
            </div>
            {asking?.id === r.id ? (
              <span className="confirm" role="group" aria-labelledby={`ask-${r.id}`}>
                <span id={`ask-${r.id}`}>
                  {asking.kind === "undo"
                    ? "Put back what these fields said before this save? Nothing else changes."
                    : "Make the whole website look exactly as it did right after this save? Every change saved after it is undone too."}
                </span>
                <button type="button" className="mini-btn solid" onClick={() => run(r.id, asking.kind)}>
                  {asking.kind === "undo" ? "Yes, undo it" : "Yes, go back"}
                </button>
                <button type="button" className="mini-btn" onClick={() => setAsking(null)} autoFocus>
                  Cancel
                </button>
              </span>
            ) : (
              <span className="history-tools">
                {r.canUndo && (
                  <button type="button" className="btn-admin secondary" disabled={busy !== null} onClick={() => setAsking({ id: r.id, kind: "undo" })}>
                    {busy === r.id ? "Working…" : "Undo this change"}
                  </button>
                )}
                {i > 0 && (
                  <button type="button" className="link-btn" disabled={busy !== null} onClick={() => setAsking({ id: r.id, kind: "restore" })}>
                    Go back to this version
                  </button>
                )}
              </span>
            )}
          </li>
        ))}
      </ol>
    </>
  );
}
