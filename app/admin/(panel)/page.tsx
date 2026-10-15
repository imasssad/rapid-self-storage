import { sectionConfigs } from "@/components/admin/sections";
import { requireUser } from "@/lib/auth";
import { ownerOnlySections, sectionKeys } from "@/lib/content-schema";
import { storageMode } from "@/lib/storage";

export default async function Overview() {
  const user = await requireUser();
  const keys = sectionKeys.filter((k) => user.role === "owner" || !ownerOnlySections.includes(k));
  return (
    <>
      <header className="page-head">
        <h1>Hello, {user.name}</h1>
        <p className="lede-admin">Choose what you&apos;d like to change. Every save updates the website within seconds, and you can undo any save from Version history.</p>
      </header>
      {storageMode() === "local" && (
        <div className="notice">Development mode: changes are saved in the project&apos;s .data folder, not the live website.</div>
      )}
      <ul className="overview">
        {keys.map((k) => (
          <li key={k}>
            <a href={`/admin/${k}`}>
              <strong>{sectionConfigs[k].title}</strong>
              <span>{sectionConfigs[k].intro}</span>
            </a>
          </li>
        ))}
        <li>
          <a href="/admin/history">
            <strong>Version history</strong>
            <span>See recent saves and put the website back to an earlier version.</span>
          </a>
        </li>
      </ul>
    </>
  );
}
