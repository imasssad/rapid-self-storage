import { story, timeline } from "@/lib/site";

export function Story() {
  return (
    <section className="section" id="story">
      <div className="wrap story-grid">
        <div>
          <div className="section-head" style={{ marginBottom: "1.75rem" }}>
            <p className="kicker">About us</p>
            <h2>A Central Valley company since 2004.</h2>
          </div>
          <div className="prose">
            {story.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>
        </div>
        <ol className="timeline" aria-label="Company history">
          {timeline.map((t) => (
            <li key={t.year}>
              <span className="year">{t.year}</span>
              <p>{t.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
