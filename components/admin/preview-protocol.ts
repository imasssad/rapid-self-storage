// Messages between an editor screen and its live preview frame (PreviewFrame ↔ PreviewCanvas).
import type { ScreenKey } from "@/lib/screens";

export type PreviewTarget = ScreenKey | "all";
export type PreviewZone = { screen: ScreenKey; part: string; top: number; height: number };
export type PreviewLayout = { height: number; zones: PreviewZone[] };

// Either side may load first, so both announce themselves: the frame sends `ready` when it starts, and the editor
// sends `hello` when it starts listening, which the frame answers with `ready`.
export const PREVIEW_MSG = {
  hello: "rss-preview:hello",
  ready: "rss-preview:ready",
  content: "rss-preview:content",
  layout: "rss-preview:layout",
} as const;
