"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { restoreVersion } from "@/app/admin/actions";

export type HistoryRow = { id: string; when: string; who: string; what: string };

export function HistoryList({ rows }: { rows: HistoryRow[] }) {
  const router = useRouter();
  const [asking, setAsking] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ ok: boolean; text: string } | null>(null);

  async function restore(id: string) {
    setBusy(id);
    setAsking(null);
    const res = await restoreVersion(id);
    setBusy(null);
    setNotice(res.ok ? { ok: true, text: res.message ?? "Restored. Your website is updated." } : { ok: false, text: res.error });
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
              <strong>{r.when}</strong>
              <span>
                {r.who} · {r.what}
              </span>
            </div>
            {i === 0 ? (
              <span className="current">Current version</span>
            ) : asking === r.id ? (
              <span className="confirm">
                <span>Put the website back to this version?</span>
                <button type="button" className="mini-btn solid" onClick={() => restore(r.id)}>
                  Yes, restore
                </button>
                <button type="button" className="mini-btn" onClick={() => setAsking(null)} autoFocus>
                  Cancel
                </button>
              </span>
            ) : (
              <button type="button" className="btn-admin secondary" disabled={busy !== null} onClick={() => setAsking(r.id)}>
                {busy === r.id ? "Restoring…" : "Restore this version"}
              </button>
            )}
          </li>
        ))}
      </ol>
    </>
  );
}
