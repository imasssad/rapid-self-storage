import type { SiteContent } from "@/lib/content-schema";

function Stars({ rating }: { rating: number }) {
  return (
    <span className="stars" role="img" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <svg key={n} viewBox="0 0 20 20" aria-hidden="true" className={n <= rating ? "on" : undefined}>
          <path d="M10 1.6l2.6 5.3 5.8.8-4.2 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.6 7.7l5.8-.8z" />
        </svg>
      ))}
    </span>
  );
}

// Shown only when at least one review is switched on in the admin panel.
export function Reviews({ reviews }: { reviews: SiteContent["reviews"] }) {
  const items = reviews.items.filter((r) => r.enabled);
  if (!items.length) return null;
  return (
    <section className="section reviews" id="reviews">
      <div className="wrap">
        <div className="section-head center" data-reveal>
          <p className="eyebrow">Reviews</p>
          <h2>{reviews.heading}</h2>
        </div>
        <ul className="review-grid">
          {items.map((r, i) => (
            <li key={r.id} className="review" data-reveal style={{ "--i": i } as React.CSSProperties}>
              <Stars rating={r.rating} />
              <blockquote>
                <p>“{r.quote}”</p>
              </blockquote>
              <p className="review-name">{r.name}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
