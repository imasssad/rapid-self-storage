import { Suspense } from "react";
import { AdminNav, type NavGroup } from "@/components/admin/AdminNav";
import { Mark } from "@/components/Mark";
import { requireUser, type Role } from "@/lib/auth";
import { screenKeys, screens } from "@/lib/screens";

// The menu follows the website: the homepage's parts from top to bottom, then details used across the site.
function navGroups(role: Role): NavGroup[] {
  const of = (group: "page" | "business" | "tools") =>
    screenKeys.filter((k) => screens[k].group === group && (!screens[k].ownerOnly || role === "owner")).map((k) => ({ href: `/admin/${k}`, label: screens[k].title }));
  return [
    { label: "", items: [{ href: "/admin", label: "Start here" }] },
    { label: "Your homepage, top to bottom", numbered: true, items: of("page") },
    { label: "Used all over the site", items: of("business") },
    {
      label: "Tools",
      items: [
        { href: "/admin/history", label: "Change history & undo" },
        ...of("tools"),
        ...(role === "owner" ? [{ href: "/admin/users", label: "People who can sign in" }] : []),
        { href: "/admin/account", label: "Your account" },
      ],
    },
  ];
}

// Reading the session cookie is request-time work, so the whole panel renders inside a Suspense boundary.
export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="admin-loading">Loading…</div>}>
      <Shell>{children}</Shell>
    </Suspense>
  );
}

async function Shell({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  return (
    <div className="admin-shell">
      <aside className="admin-side">
        <a className="admin-brand" href="/admin">
          <Mark />
          <span>Website editor</span>
        </a>
        <AdminNav groups={navGroups(user.role)} user={{ name: user.name, role: user.role }} />
        <a className="btn-admin secondary view-site" href="/" target="_blank" rel="noopener">
          View website ↗
        </a>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  );
}
