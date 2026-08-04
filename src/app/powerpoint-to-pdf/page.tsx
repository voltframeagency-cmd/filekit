import { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "PowerPoint to PDF - Convert PPTX Presentations to PDF Online",
  description: "Convert PowerPoint PPTX presentations to PDF documents with high fidelity and zero file retention.",
  robots: {
    index: false,
    follow: false
  }
};

export default function PowerPointToPdfPlannedPage() {
  // Product-Access Governance: Return HTTP 404 for PLANNED/Quarantined routes
  // until workspace, engine connection, and release evidence pass.
  notFound();
}
