import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SectionEditor } from "@/components/admin/SectionEditor";
import { requireUser } from "@/lib/auth";
import { readContent } from "@/lib/content";
import { isSectionKey, ownerOnlySections } from "@/lib/content-schema";
import { storageMode } from "@/lib/storage";

export const metadata: Metadata = { title: "Edit" };

export default async function SectionPage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  if (!isSectionKey(section)) notFound();
  const user = await requireUser();
  if (ownerOnlySections.includes(section) && user.role !== "owner") {
    return (
      <header className="page-head">
        <h1>Only an owner can change this</h1>
        <p className="lede-admin">Ask an owner if something here needs to change.</p>
      </header>
    );
  }
  const content = await readContent();
  return <SectionEditor key={section} section={section} initial={content[section]} storageMode={storageMode()} />;
}
