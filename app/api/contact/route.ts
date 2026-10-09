import { NextResponse } from "next/server";
import { contactLocations, site } from "@/lib/site";

export const runtime = "nodejs";

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

const clip = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "The form data couldn't be read. Refresh the page and try again." }, { status: 400 });
  }

  // Bots fill the hidden field; pretend it worked.
  if (clip(body.company, 200)) return NextResponse.json({ ok: true });

  const name = clip(body.name, 120);
  const email = clip(body.email, 200);
  const phone = clip(body.phone, 40);
  const message = clip(body.message, 4000);
  const locationValue = clip(body.location, 40);
  const location = contactLocations.find((l) => l.value === locationValue)?.label ?? "Tulare, 1682 N J St";

  if (!name || !/^\S+@\S+\.\S+$/.test(email)) {
    return NextResponse.json({ message: "Enter your name and a valid email address." }, { status: 422 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!apiKey || !to || !from) {
    return NextResponse.json(
      { message: `Online messages aren't set up yet. Call ${site.phoneDisplay} to reach the office.` },
      { status: 503 },
    );
  }

  const rows: [string, string][] = [
    ["Name", name],
    ["Email", email],
    ["Phone", phone || "Not given"],
    ["Location", location],
    ["Message", message || "No message"],
  ];
  const html = `<h2>New message from rapidselfstorage.com</h2><table cellpadding="6">${rows
    .map(([k, v]) => `<tr><td valign="top"><strong>${k}</strong></td><td>${esc(v).replace(/\n/g, "<br>")}</td></tr>`)
    .join("")}</table>`;
  const text = rows.map(([k, v]) => `${k}: ${v}`).join("\n");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: to.split(",").map((s) => s.trim()),
      reply_to: email,
      subject: `Website message from ${name} (${location})`,
      html,
      text,
    }),
  });

  if (!res.ok) {
    console.error("Resend error", res.status, await res.text().catch(() => ""));
    return NextResponse.json(
      { message: `The message didn't go through. Call ${site.phoneDisplay} to reach the office.` },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
