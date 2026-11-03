import type { Metadata } from "next";
import { lang } from "next/root-params";
import { sectionStackGap } from "@/components/general-layout";
import { VenezuelaFieldToMarket } from "@/components/venezuela-field-to-market";
import { VenezuelaHero } from "@/components/venezuela-hero";
import { VenezuelaPageContent } from "@/components/venezuela-page";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { createPageMetadata } from "@/seo";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await lang();
  const resolvedLocale = isLocale(locale) ? locale : "en";
  const dict = await getDictionary();
  const { venezuela } = dict.meta.pages;

  return createPageMetadata({
    locale: resolvedLocale,
    path: "/venezuela",
    title: venezuela.title,
    description: venezuela.description,
    siteName: dict.meta.siteName,
  });
}

export default async function VenezuelaPage() {
  const dict = await getDictionary();
  const { venezuelaPage, venezuelaFieldToMarket } = dict;

  return (
    <main className={`flex flex-col ${sectionStackGap}`}>
      <VenezuelaHero
        eyebrow={venezuelaPage.eyebrow}
        title={venezuelaPage.title}
        subtitle={venezuelaPage.lead}
        ctaLabel={venezuelaPage.ctaLabel}
        ctaHref="#field-to-market"
      />
      <VenezuelaPageContent
        stepsLabel={venezuelaPage.eyebrow}
        steps={venezuelaPage.steps}
      />
      <VenezuelaFieldToMarket
        eyebrow={venezuelaFieldToMarket.eyebrow}
        lines={venezuelaFieldToMarket.lines}
        stages={venezuelaFieldToMarket.stages}
      />
    </main>
  );
}
