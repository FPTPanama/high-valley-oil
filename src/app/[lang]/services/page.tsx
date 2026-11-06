import type { Metadata } from "next";
import { lang } from "next/root-params";
import { sectionStackGap } from "@/components/general-layout";
import { PageHero } from "@/components/page-hero";
import { ServicesPageContent } from "@/components/services-page";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { createPageMetadata } from "@/seo";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await lang();
  const resolvedLocale = isLocale(locale) ? locale : "en";
  const dict = await getDictionary();
  const { services } = dict.meta.pages;

  return createPageMetadata({
    locale: resolvedLocale,
    path: "/services",
    title: services.title,
    description: services.description,
    siteName: dict.meta.siteName,
  });
}

export default async function ServicesPage() {
  const dict = await getDictionary();
  const { servicesPage } = dict;
  const { items } = dict.home.services;

  return (
    <main className={`flex flex-col ${sectionStackGap}`}>
      {/* TEMP services-mobile-responsive: hero + services list; polish section by section. */}
      <PageHero
        eyebrow={servicesPage.eyebrow}
        title={servicesPage.title}
        subtitle={servicesPage.lead}
        backgroundSrc="/images/obreros_en_fabrica.webp"
        ctaLabel={servicesPage.ctaLabel}
        ctaHref="#services"
      />
      <ServicesPageContent
        eyebrow={dict.home.services.eyebrow}
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
