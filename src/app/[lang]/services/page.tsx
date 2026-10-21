import type { Metadata } from "next";
import { PageHeading } from "@/components/page-heading";
import { getDictionary } from "@/i18n/dictionaries";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();

  return { title: dict.nav.services };
}

export default async function ServicesPage() {
  const dict = await getDictionary();

  return <PageHeading title={dict.nav.services} />;
}
