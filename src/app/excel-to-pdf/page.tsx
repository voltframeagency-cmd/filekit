import { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Excel to PDF - Convert Excel Spreadsheets to PDF Online",
  description: "Convert XLSX and XLS spreadsheets to PDF documents with high fidelity and zero file retention.",
  robots: {
    index: false,
    follow: false
  }
};

export default function ExcelToPdfPlannedPage() {
  // Product-Access Governance: Return HTTP 404 for PLANNED/Quarantined routes
  // until workspace, engine connection, and release evidence pass.
  notFound();
}
