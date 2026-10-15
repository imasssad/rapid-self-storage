import { FindBox } from "@/components/admin/FindBox";
import { HomeMap } from "@/components/admin/HomeMap";
import { requireUser } from "@/lib/auth";
import { readContent } from "@/lib/content";
import { screens } from "@/lib/screens";
import { storageMode } from "@/lib/storage";

// The jobs people come here for most, each one click from the start screen.
const tasks = [
  { href: "/admin/units#f-units-items", title: "Change a price", text: "Or mark a unit size as sold out." },
  { href: "/admin/specials", title: "Post a special offer", text: "A deal in the bar at the very top of the site." },
  { href: "/admin/navbar", title: "Change the menu or logo", text: "Logo, menu links, top buttons and the Pay link." },
  { href: "/admin/contact#f-contact-gateOpens", title: "Change opening hours", text: "Gate hours and office hours." },
  { href: "/admin/contact#f-contact-phone", title: "Change phone or address", text: "Updates the header, contact section and footer." },
  { href: "/admin/photos", title: "Replace a photo", text: "Any of the four big photos." },
  { href: "/admin/reviews", title: "Add a customer review", text: "Real reviews only, with permission." },
  { href: "/admin/faq", title: "Edit questions & answers", text: "Add, change or reorder questions." },
  { href: "/admin/history", title: "Undo a change", text: "See what was changed and undo it." },
];

export default async function Start() {
  const user = await requireUser();
  const owner = user.role === "owner";
  const content = await readContent();
  const visible = owner ? content : { ...content, settings: { ...content.settings, contactEmails: [] } };
  const cards = [
    { href: "/admin/contact", title: screens.contact.title, text: screens.contact.blurb },
    { href: "/admin/photos", title: screens.photos.title, text: screens.photos.blurb },
  ];
  const tools = [
    { href: "/admin/history", title: "Change history & undo", text: "See what was changed and when, and undo any change." },
    ...(owner
      ? [
          { href: "/admin/settings", title: screens.settings.title, text: screens.settings.blurb },
          { href: "/admin/users", title: "People who can sign in", text: "Give someone access, reset a password, or remove access." },
        ]
      : []),
    { href: "/admin/account", title: "Your account", text: "Change your password." },
  ];

  return (
    <div className="start">
      <header className="page-head">
        <h1>Hello, {user.name}</h1>
        <p className="lede-admin">
          Everything on your website can be changed here. Find what you want below, change it, and press <strong>Save changes</strong>. The website
          updates within seconds, and any save can be undone.
        </p>
      </header>
      {storageMode() === "local" && (
        <div className="notice">Test copy: changes are saved on this computer only, not on your live website.</div>
      )}

      <FindBox owner={owner} />

      <section className="start-section" aria-labelledby="tasks-title">
        <h2 id="tasks-title">Common tasks</h2>
        <ul className="tasks">
          {tasks.map((t) => (
            <li key={t.href}>
              <a href={t.href}>
                <strong>{t.title}</strong>
                <span>{t.text}</span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="start-section" aria-labelledby="map-title">
        <h2 id="map-title">Your homepage, top to bottom</h2>
        <p className="help">Click any part of the page to change it. The website is one long page, so its parts are listed in the same order.</p>
        <HomeMap content={visible} />
      </section>

      <section className="start-section" aria-labelledby="business-title">
        <h2 id="business-title">Used all over the site</h2>
        <ul className="overview">
          {cards.map((c) => (
            <li key={c.href}>
              <a href={c.href}>
                <strong>{c.title}</strong>
                <span>{c.text}</span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="start-section" aria-labelledby="tools-title">
        <h2 id="tools-title">Tools</h2>
        <ul className="overview">
          {tools.map((c) => (
            <li key={c.href}>
              <a href={c.href}>
                <strong>{c.title}</strong>
                <span>{c.text}</span>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
