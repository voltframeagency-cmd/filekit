"use client";

import React from "react";
import { useParams } from "next/navigation";
import UniversalToolPage from "@/components/layout/UniversalToolPage";

export default function LocalizedToolPage() {
  const params = useParams();
  const rawLang = (params?.lang as string) || "en";
  const rawSlug = (params?.slug as string) || "";
  const normSlug = rawSlug.startsWith("/") ? rawSlug : `/${rawSlug}`;

  return <UniversalToolPage slug={normSlug} locale={rawLang} />;
}
