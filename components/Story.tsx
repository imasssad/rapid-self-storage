import { story, timeline } from "@/lib/site";

export function Story() {
  return (
    <section className="section" id="story">
      <div className="wrap story-grid">
        <div data-reveal>
          <div className="section-head">
            <p className="eyebrow">Our story</p>
            <h2>A Central Valley company since 2004.</h2>
          </div>
          <div className="prose">
            {story.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>
        </div>
        <div className="timeline-wrap">
          <p className="timeline-title" data-reveal>
            Our history
          </p>
          <div className="timeline">
            <span className="timeline-line" data-reveal="line-y" aria-hidden="true" />
            <ol aria-label="Company history">
              {timeline.map((t, i) => (
                <li key={t.year} data-reveal style={{ "--i": i + 1 } as React.CSSProperties}>
                  <span className="year">{t.year}</span>
                  <p>{t.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
