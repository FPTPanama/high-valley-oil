import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary } from "@/i18n/dictionaries";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();

  return {
    title: dict.notFound.title,
    robots: { index: false, follow: false },
  };
}

export default function UnknownPage() {
  notFound();
}
