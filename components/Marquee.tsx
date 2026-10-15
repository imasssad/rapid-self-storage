import { Icon } from "./Icon";

function List({ items, hidden }: { items: string[]; hidden?: boolean }) {
  return (
    <ul aria-hidden={hidden || undefined}>
      {items.map((a, i) => (
        <li key={i}>
          <Icon name="check" className="icon-sm" />
          {a}
        </li>
      ))}
    </ul>
  );
}

// Two copies of the list scroll as one strip so the loop has no seam; the copy is hidden from screen readers.
export function Marquee({ items }: { items: string[] }) {
  if (!items.length) return null;
  return (
    <section className="marquee" aria-label="Amenities">
      <div className="marquee-viewport">
        <div className="marquee-track">
          <List items={items} />
          <List items={items} hidden />
        </div>
      </div>
    </section>
  );
}
