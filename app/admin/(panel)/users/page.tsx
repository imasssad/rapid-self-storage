import type { Metadata } from "next";
import { UsersManager } from "@/components/admin/UsersManager";
import { loadUsers, requireUser } from "@/lib/auth";

export const metadata: Metadata = { title: "People" };

export default async function UsersPage() {
  const user = await requireUser();
  if (user.role !== "owner") {
    return (
      <header className="page-head">
        <h1>Only an owner can manage people</h1>
        <p className="lede-admin">Ask an owner to add someone or reset a password.</p>
      </header>
    );
  }
  const people = ((await loadUsers()) ?? []).map(({ email, name, role }) => ({ email, name, role }));
  return (
    <>
      <header className="page-head">
        <h1>People</h1>
        <p className="lede-admin">Everyone who can sign in to edit the website. Editors can change text, prices and photos; owners can also manage people and settings.</p>
      </header>
      <UsersManager people={people} me={user.email} />
    </>
  );
}
