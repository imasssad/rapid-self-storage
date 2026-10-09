import Link from "next/link";

export default function NotFound() {
  return (
    <main className="section">
      <div className="wrap" style={{ display: "grid", gap: "1.5rem", justifyItems: "start" }}>
        <h1>This page has moved.</h1>
        <p className="lede">The Rapid Self Storage site is now a single page. Everything is on the home page.</p>
        <Link className="btn btn-blue" href="/">
          Go to the home page
        </Link>
      </div>
    </main>
  );
}
