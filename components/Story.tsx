import type { SiteContent } from "@/lib/content-schema";

export function Story({ about }: { about: SiteContent["about"] }) {
  return (
    <section className="section" id="story">
      <div className="wrap story-grid">
        <div data-reveal>
          <div className="section-head">
            <p className="eyebrow">Our story</p>
            <h2>{about.heading}</h2>
          </div>
          <div className="prose">
            {about.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
        {about.timeline.length > 0 && (
          <div className="timeline-wrap">
            <p className="timeline-title" data-reveal>
              Our history
            </p>
            <div className="timeline">
              <span className="timeline-line" data-reveal="line-y" aria-hidden="true" />
              <ol aria-label="Company history">
                {about.timeline.map((t, i) => (
                  <li key={i} data-reveal style={{ "--i": i + 1 } as React.CSSProperties}>
                    <span className="year">{t.year}</span>
                    <p>{t.text}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
