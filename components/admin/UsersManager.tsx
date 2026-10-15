"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { addUser, removeUser, resetUserPassword, type ActionResult } from "@/app/admin/actions";

type Person = { email: string; name: string; role: "owner" | "editor" };

/** A readable random password, for handing over by phone or in person. */
function suggestPassword() {
  const words = "maple river stone cedar harbor meadow canyon willow summit orchard prairie lantern".split(" ");
  const pick = () => words[crypto.getRandomValues(new Uint32Array(1))[0] % words.length];
  return `${pick()}-${pick()}-${100 + (crypto.getRandomValues(new Uint32Array(1))[0] % 900)}`;
}

function Notice({ result }: { result: ActionResult | null }) {
  if (!result) return null;
  return (
    <div className={result.ok ? "notice ok" : "notice error"} role="status">
      {result.ok ? result.message : result.error}
    </div>
  );
}

export function UsersManager({ people, me }: { people: Person[]; me: string }) {
  const router = useRouter();
  const [result, setResult] = useState<ActionResult | null>(null);
  const [form, setForm] = useState({ name: "", email: "", role: "editor", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [resetFor, setResetFor] = useState<string | null>(null);
  const [resetPw, setResetPw] = useState("");
  const [removing, setRemoving] = useState<string | null>(null);
  const owners = people.filter((p) => p.role === "owner").length;

  async function run(fn: () => Promise<ActionResult>) {
    setBusy(true);
    const res = await fn();
    setBusy(false);
    setResult(res);
    if (res.ok) router.refresh();
    return res;
  }

  async function onAdd(e: React.FormEvent) {
    e.preventDefault();
    const res = await run(() => addUser(form));
    setErrors(!res.ok && res.fieldErrors ? res.fieldErrors : {});
    if (res.ok) setForm({ name: "", email: "", role: "editor", password: "" });
  }

  return (
    <>
      <Notice result={result} />
      <ul className="people">
        {people.map((p) => (
          <li key={p.email}>
            <div className="person">
              <strong>{p.name}</strong>
              <span>{p.email}</span>
              <span className="role">{p.role === "owner" ? "Owner" : "Editor"}</span>
            </div>
            <div className="person-tools">
              {resetFor === p.email ? (
                <form
                  className="inline-form"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const res = await run(() => resetUserPassword(p.email, resetPw));
                    if (res.ok) {
                      setResetFor(null);
                      setResetPw("");
                    }
                  }}
                >
                  <label htmlFor={`pw-${p.email}`}>New temporary password</label>
                  <input id={`pw-${p.email}`} type="text" value={resetPw} onChange={(e) => setResetPw(e.target.value)} autoComplete="off" />
                  <button type="button" className="mini-btn" onClick={() => setResetPw(suggestPassword())}>
                    Suggest one
                  </button>
                  <button type="submit" className="mini-btn solid" disabled={busy}>
                    Set password
                  </button>
                  <button type="button" className="mini-btn" onClick={() => setResetFor(null)}>
                    Cancel
                  </button>
                </form>
              ) : removing === p.email ? (
                <span className="confirm">
                  <span>Remove {p.name}&apos;s access?</span>
                  <button type="button" className="mini-btn danger solid" disabled={busy} onClick={() => run(() => removeUser(p.email)).then(() => setRemoving(null))}>
                    Yes, remove
                  </button>
                  <button type="button" className="mini-btn" onClick={() => setRemoving(null)} autoFocus>
                    Cancel
                  </button>
                </span>
              ) : (
                <>
                  <button type="button" className="mini-btn" onClick={() => { setResetFor(p.email); setResetPw(""); }}>
                    Reset password
                  </button>
                  {p.email !== me && !(p.role === "owner" && owners === 1) && (
                    <button type="button" className="mini-btn danger" onClick={() => setRemoving(p.email)}>
                      Remove
                    </button>
                  )}
                </>
              )}
            </div>
          </li>
        ))}
      </ul>

      <form className="group add-person" onSubmit={onAdd} noValidate>
        <h2>Add a person</h2>
        <p className="help">They sign in at this same address with their email and the temporary password you give them, then change it under Your account.</p>
        {(
          [
            ["name", "Name", "text", "name"],
            ["email", "Email", "email", "email"],
          ] as const
        ).map(([key, label, type, auto]) => (
          <div className="field" key={key}>
            <label htmlFor={`new-${key}`}>{label}</label>
            <input
              id={`new-${key}`}
              type={type}
              autoComplete={auto === "name" ? "off" : "off"}
              value={form[key]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              aria-invalid={errors[key] ? true : undefined}
            />
            {errors[key] && <p className="field-error">{errors[key]}</p>}
          </div>
        ))}
        <div className="field">
          <label htmlFor="new-role">What can they do?</label>
          <select id="new-role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
            <option value="editor">Editor: change website text, prices and photos</option>
            <option value="owner">Owner: everything, including people and settings</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="new-password">Temporary password</label>
          <p className="help">At least 10 characters.</p>
          <div className="input-row">
            <input
              id="new-password"
              type="text"
              autoComplete="off"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              aria-invalid={errors.password ? true : undefined}
            />
            <button type="button" className="mini-btn" onClick={() => setForm({ ...form, password: suggestPassword() })}>
              Suggest one
            </button>
          </div>
          {errors.password && <p className="field-error">{errors.password}</p>}
        </div>
        <button type="submit" className="btn-admin primary" disabled={busy}>
          {busy ? "Adding…" : "Add person"}
        </button>
      </form>
    </>
  );
}
