import type { Metadata } from "next";
import { PreviewCanvas } from "@/components/admin/PreviewCanvas";

export const metadata: Metadata = { title: "Preview" };

// Shown inside the editor's preview frame. It holds no data of its own: the editor sends the draft to it.
export default function PreviewPage() {
  return <PreviewCanvas />;
}
