import { notFound } from "next/navigation";

export default function PlannedRoutePage() {
  // Product-Access Governance: Return HTTP 404 for PLANNED routes
  // until workspace, engine connection, and release evidence pass.
  notFound();
}
