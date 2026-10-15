// Fixed facts about the website itself. These change only with a developer (new domain, new business name),
// so they aren't editable in the admin panel.
export const brand = {
  name: "Rapid Self Storage",
  url: "https://rapidselfstorage.com",
  description:
    "Tulare's best choice for convenient, safe and affordable self storage. Drive-up units from 5×5 to 20×20, month-to-month rentals with no deposit, and an individual gate code for every tenant.",
  // Internal staff schedule from the old /employee page. Not linked from the public site.
  employeeCalendarUrl:
    "https://calendar.google.com/calendar/embed?src=9kca4svl1gpf51h21irc0jd248%40group.calendar.google.com&ctz=America%2FLos_Angeles",
} as const;
