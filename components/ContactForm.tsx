"use client";

import { useState, type FormEvent } from "react";
import { contactLocations, site } from "@/lib/site";

type State = { kind: "idle" | "sending" | "sent" | "error"; message: string };

export function ContactForm() {
  const [state, setState] = useState<State>({ kind: "idle", message: "" });

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;

    if (!data.name?.trim()) {
      setState({ kind: "error", message: "Enter your name so we know who to ask for." });
      form.querySelector<HTMLInputElement>("#f-name")?.focus();
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(data.email ?? "")) {
      setState({ kind: "error", message: "Enter an email address we can reply to." });
      form.querySelector<HTMLInputElement>("#f-email")?.focus();
      return;
    }

    setState({ kind: "sending", message: "Sending…" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = (await res.json().catch(() => ({}))) as { message?: string };
      if (res.ok) {
        form.reset();
        setState({ kind: "sent", message: "Message sent. The office will get back to you soon." });
      } else {
        setState({
          kind: "error",
          message: body.message ?? `The message didn't go through. Call ${site.phoneDisplay} to reach the office.`,
        });
      }
    } catch {
      setState({
        kind: "error",
        message: `The message didn't go through. Check your connection or call ${site.phoneDisplay}.`,
      });
    }
  }

  return (
    <form className="form" onSubmit={onSubmit} noValidate>
      <div className="field">
        <label htmlFor="f-name">Full name</label>
        <input id="f-name" name="name" type="text" autoComplete="name" required maxLength={120} />
      </div>
      <div className="field">
        <label htmlFor="f-phone">Phone</label>
        <input id="f-phone" name="phone" type="tel" autoComplete="tel" maxLength={40} />
      </div>
      <div className="field full">
        <label htmlFor="f-email">Email</label>
        <input id="f-email" name="email" type="email" autoComplete="email" required maxLength={200} />
      </div>
      <div className="field full">
        <label htmlFor="f-location">Location</label>
        <select id="f-location" name="location" defaultValue="tulare" required>
          {contactLocations.map((l) => (
            <option key={l.value} value={l.value}>
              {l.label}
            </option>
          ))}
        </select>
      </div>
      <div className="field full">
        <label htmlFor="f-message">Message</label>
        <textarea id="f-message" name="message" maxLength={4000} />
      </div>
      {/* Spam trap: hidden from people, often filled in by bots. */}
      <div hidden aria-hidden="true">
        <label htmlFor="f-company">Company</label>
        <input id="f-company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="form-foot">
        <button className="btn btn-blue" type="submit" disabled={state.kind === "sending"}>
          {state.kind === "sending" ? "Sending…" : "Send message"}
        </button>
        <p className="form-status" role="status" aria-live="polite" data-state={state.kind}>
          {state.message}
        </p>
      </div>
    </form>
  );
}
