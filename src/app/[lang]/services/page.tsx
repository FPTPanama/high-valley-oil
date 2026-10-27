import type { Metadata } from "next";
import { GeneralLayout } from "@/components/general-layout";
import { ServicesPageContent } from "@/components/services-page";
import { getDictionary } from "@/i18n/dictionaries";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();

  return { title: dict.nav.services };
}

export default async function ServicesPage() {
  const dict = await getDictionary();
  const { servicesPage } = dict;
  const { items } = dict.home.services;

  return (
    <GeneralLayout>
      <ServicesPageContent
        eyebrow={servicesPage.eyebrow}
        title={servicesPage.title}
        lead={servicesPage.lead}
        items={items.map(({ index, title, slug, body, points }) => ({
          index,
          title,
          slug,
          body,
          points,
        }))}
      />
    </GeneralLayout>
  );
}
