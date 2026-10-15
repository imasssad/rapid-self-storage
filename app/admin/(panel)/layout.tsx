import { Suspense } from "react";
import { AdminNav, type NavItem } from "@/components/admin/AdminNav";
import { Mark } from "@/components/Mark";
import { requireUser } from "@/lib/auth";

const items: (NavItem & { ownerOnly?: boolean })[] = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/specials", label: "Specials" },
  { href: "/admin/units", label: "Unit sizes & prices" },
  { href: "/admin/contact", label: "Hours & contact" },
  { href: "/admin/home", label: "Homepage text" },
  { href: "/admin/photos", label: "Photos" },
  { href: "/admin/about", label: "About & history" },
  { href: "/admin/locations", label: "Locations" },
  { href: "/admin/reviews", label: "Reviews" },
  { href: "/admin/settings", label: "Settings", ownerOnly: true },
  { href: "/admin/users", label: "People", ownerOnly: true },
  { href: "/admin/history", label: "Version history" },
  { href: "/admin/account", label: "Your account" },
];

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
  const visible = items.filter((i) => !i.ownerOnly || user.role === "owner").map(({ href, label }) => ({ href, label }));
  return (
    <div className="admin-shell">
      <aside className="admin-side">
        <a className="admin-brand" href="/admin">
          <Mark />
          <span>Website editor</span>
        </a>
        <AdminNav items={visible} user={{ name: user.name, role: user.role }} />
        <a className="btn-admin secondary view-site" href="/" target="_blank" rel="noopener">
          View website ↗
        </a>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  );
}
