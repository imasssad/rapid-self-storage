import { amenities } from "@/lib/site";
import { Icon } from "./Icon";

function List({ hidden }: { hidden?: boolean }) {
  return (
    <ul aria-hidden={hidden || undefined}>
      {amenities.map((a) => (
        <li key={a}>
          <Icon name="check" className="icon-sm" />
          {a}
        </li>
      ))}
    </ul>
  );
}

// Two copies of the list scroll as one strip so the loop has no seam; the copy is hidden from screen readers.
export function Marquee() {
  return (
    <section className="marquee" aria-label="Amenities">
      <div className="marquee-viewport">
        <div className="marquee-track">
          <List />
          <List hidden />
        </div>
      </div>
    </section>
  );
}
