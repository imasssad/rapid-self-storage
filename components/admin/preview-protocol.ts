// Messages between an editor screen and its live preview frame (PreviewFrame ↔ PreviewCanvas).
import type { ScreenKey } from "@/lib/screens";

export type PreviewTarget = ScreenKey | "all";
export type PreviewZone = { screen: ScreenKey; part: string; top: number; height: number };
export type PreviewLayout = { height: number; zones: PreviewZone[] };

export const PREVIEW_MSG = {
  ready: "rss-preview:ready",
  content: "rss-preview:content",
  layout: "rss-preview:layout",
} as const;
