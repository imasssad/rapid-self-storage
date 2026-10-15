import type { Metadata } from "next";
import Link from "next/link";
import { brand } from "@/lib/brand";

// Kept from the old site so staff bookmarks keep working. Not linked anywhere and not indexed.
export const metadata: Metadata = {
  title: "Employee schedule",
  robots: { index: false, follow: false },
};

export default function EmployeePage() {
  return (
    <main className="section employee">
      <div className="wrap">
        <Link className="text-link" href="/">
          ← {brand.name}
        </Link>
        <h1>Employee schedule</h1>
        <iframe title="Employee schedule calendar" src={brand.employeeCalendarUrl} loading="lazy" />
      </div>
    </main>
  );
}
