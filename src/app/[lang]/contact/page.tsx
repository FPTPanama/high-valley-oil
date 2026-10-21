import type { Metadata } from "next";
import { PageHeading } from "@/components/page-heading";
import { getDictionary } from "@/i18n/dictionaries";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();

  return { title: dict.nav.contact };
}

export default async function ContactPage() {
  const dict = await getDictionary();

  return <PageHeading title={dict.nav.contact} />;
}
