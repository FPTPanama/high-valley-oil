import type { Metadata } from "next";
import { sectionStackGap } from "@/components/general-layout";
import { PageHero } from "@/components/page-hero";
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
    <main className={`flex flex-col ${sectionStackGap}`}>
      <PageHero
        eyebrow={servicesPage.eyebrow}
        title={servicesPage.title}
        subtitle={servicesPage.lead}
      />
      <ServicesPageContent
        items={items.map(({ index, title, slug, body, points }) => ({
          index,
          title,
          slug,
          body,
          points,
        }))}
      />
    </main>
  );
}
