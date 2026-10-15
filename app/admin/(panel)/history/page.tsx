import type { Metadata } from "next";
import { HistoryList } from "@/components/admin/HistoryList";
import { sectionConfigs } from "@/components/admin/sections";
import { loadUsers, requireUser } from "@/lib/auth";
import { listHistory } from "@/lib/content";

export const metadata: Metadata = { title: "Version history" };

export default async function HistoryPage() {
  await requireUser();
  const [history, users] = await Promise.all([listHistory(), loadUsers()]);
  const nameOf = (email: string, fallback: string) => users?.find((u) => u.email === email)?.name ?? fallback;
  const rows = history.map((h) => ({
    id: h.id,
    when: new Date(h.savedAt).toLocaleString("en-US", { timeZone: "America/Los_Angeles", dateStyle: "medium", timeStyle: "short" }),
    who: nameOf(h.savedBy.email, h.savedBy.name || h.savedBy.email),
    what: h.section === "restore" ? (h.note ?? "Restored an earlier version") : `Changed ${sectionConfigs[h.section]?.title ?? h.section}`,
  }));
  return (
    <>
      <header className="page-head">
        <h1>Version history</h1>
        <p className="lede-admin">The last 20 saves, newest first. Restoring a version puts the whole website back the way it was then, and is itself saved as a new version, so you can undo it too.</p>
      </header>
      <HistoryList rows={rows} />
    </>
  );
}
