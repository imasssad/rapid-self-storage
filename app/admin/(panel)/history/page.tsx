import type { Metadata } from "next";
import { HistoryList } from "@/components/admin/HistoryList";
import { loadUsers, requireUser } from "@/lib/auth";
import { listHistory } from "@/lib/content";
import { isScreenKey, legacySectionTitles, screens } from "@/lib/screens";
import { describeChanges } from "@/components/admin/screen-fields";

export const metadata: Metadata = { title: "Change history & undo" };

export default async function HistoryPage() {
  await requireUser();
  const [history, users] = await Promise.all([listHistory(), loadUsers()]);
  const nameOf = (email: string, fallback: string) => users?.find((u) => u.email === email)?.name ?? fallback;
  const rows = history.map((h) => ({
    id: h.id,
    when: new Date(h.savedAt).toLocaleString("en-US", { timeZone: "America/Los_Angeles", dateStyle: "medium", timeStyle: "short" }),
    who: nameOf(h.savedBy.email, h.savedBy.name || h.savedBy.email),
    what:
      h.section === "restore"
        ? (h.note ?? "Went back to an earlier version")
        : `Changed ${isScreenKey(h.section) ? screens[h.section].title : (legacySectionTitles[h.section] ?? h.section)}`,
    details: h.changes?.length ? describeChanges(h.changes) : "",
    canUndo: Boolean(h.changes?.length),
  }));
  return (
    <>
      <header className="page-head">
        <h1>Change history &amp; undo</h1>
        <p className="lede-admin">
          The last 20 saves, newest first. <strong>Undo this change</strong> puts back only what that one save changed. <strong>Go back to this version</strong> makes the
          whole website look exactly as it did right after that save. Either way it&apos;s saved as a new version, so you can undo it too.
        </p>
      </header>
      <HistoryList rows={rows} />
    </>
  );
}
