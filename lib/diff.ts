// Which fields differ between two versions of the site content, as paths ("home", "hero", "headline"). A list
// that gained or lost items counts as one change to the whole list. Used to describe and undo single saves.
type Path = (string | number)[];

const isObject = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);

export function changedPaths(a: unknown, b: unknown, limit = 60): Path[] {
  const out: Path[] = [];
  const walk = (x: unknown, y: unknown, path: Path) => {
    if (out.length >= limit) return;
    if (isObject(x) && isObject(y)) {
      for (const k of new Set([...Object.keys(x), ...Object.keys(y)])) walk(x[k], y[k], [...path, k]);
    } else if (Array.isArray(x) && Array.isArray(y) && x.length === y.length) {
      x.forEach((item, i) => walk(item, y[i], [...path, i]));
    } else if (JSON.stringify(x) !== JSON.stringify(y)) {
      out.push(path);
    }
  };
  walk(a, b, []);
  return out;
}
