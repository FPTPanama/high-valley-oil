import { lang } from "next/root-params";
import { sectionStackGap } from "@/components/general-layout";
import { HomeCompanySection } from "@/components/home-company-section";
import { HomeHero } from "@/components/home-hero";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

export default async function HomePage() {
  const dict = await getDictionary();
  const locale = await lang();
  const hrefLocale = isLocale(locale) ? locale : "en";
  const { hero, company } = dict.home;

  return (
    <main className={`flex flex-col ${sectionStackGap}`}>
      <HomeHero
        title={hero.title}
        subtitle={hero.subtitle}
        ctaLabel={hero.cta}
        ctaHref={`/${hrefLocale}/our-business`}
      />
      <HomeCompanySection
        index={company.index}
        eyebrow={company.eyebrow}
        title={company.title}
        lead={company.lead}
        body={company.body}
        ctaLabel={company.cta}
        ctaHref={`/${hrefLocale}/our-company`}
      />
    </main>
  );
}
