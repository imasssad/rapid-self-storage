// Set next to the session cookie for signed-in editors, and readable by the website's own script so it can show an
// "Edit this part" bar (components/EditBar.tsx). It grants nothing: every admin page and action checks the session.
export const EDITOR_HINT_COOKIE = "rss_editor";
