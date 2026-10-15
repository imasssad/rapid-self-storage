"use client";

// Sidebar on desktop, a "Menu" dropdown on phones. Plain links (full page loads) so the
// unsaved-changes warning always gets a chance to run.
import { usePathname } from "next/navigation";
import { logout } from "@/app/admin/actions";

export type NavItem = { href: string; label: string };
export type NavGroup = { label: string; numbered?: boolean; items: NavItem[] };

export function AdminNav({ groups, user }: { groups: NavGroup[]; user: { name: string; role: string } }) {
  const pathname = usePathname();
  const links = groups.map((g, gi) => {
    const List = g.numbered ? "ol" : "ul";
    return (
      <div key={gi} className="nav-group">
        {g.label && <p className="nav-label">{g.label}</p>}
        <List className={g.numbered ? "numbered" : undefined}>
          {g.items.map((item) => (
            <li key={item.href}>
              <a href={item.href} aria-current={pathname === item.href ? "page" : undefined}>
                {item.label}
              </a>
            </li>
          ))}
        </List>
      </div>
    );
  });
  return (
    <>
      <nav className="admin-nav" aria-label="Admin">
        {links}
      </nav>
      <details className="admin-menu">
        <summary>Menu</summary>
        <nav aria-label="Admin">{links}</nav>
      </details>
      <div className="admin-user">
        <p>
          Signed in as <strong>{user.name}</strong>
          <span className="role">{user.role === "owner" ? "Owner" : "Editor"}</span>
        </p>
        <form action={logout}>
          <button type="submit" className="link-btn">
            Sign out
          </button>
        </form>
      </div>
    </>
  );
}
