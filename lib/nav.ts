// Menu links are edited in the admin panel (navbar.links). Each goes to a section of the homepage by its id,
// or to any web address.
import type { SiteContent } from "./content-schema";

export type MenuLink = SiteContent["navbar"]["links"][number];

export const menuHref = (link: MenuLink) => (link.to === "link" ? link.url : `#${link.to}`);

/** "Visalia Noble login" and so on: the other locations' own login links, taken from their cards in Locations. */
export const otherLocationLogins = (items: SiteContent["locations"]["items"]) =>
  items.filter((l) => !l.highlight && l.buttonUrl).map((l) => ({ label: `${l.name} login`, href: l.buttonUrl }));
