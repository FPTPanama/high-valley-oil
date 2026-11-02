import type { Metadata } from "next";
import { lang } from "next/root-params";
import { sectionStackGap } from "@/components/general-layout";
import { BusinessPageFocuses } from "@/components/business-page-focuses";
import { BusinessPageIntro } from "@/components/business-page-intro";
import { BusinessPageMethod } from "@/components/business-page-method";
import { PageHero } from "@/components/page-hero";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();

  return { title: dict.nav.ourBusiness };
}

export default async function OurBusinessPage() {
  const dict = await getDictionary();
  const locale = await lang();
  const hrefLocale = isLocale(locale) ? locale : "en";
  const { businessPage } = dict;
  const { focuses } = dict.home.business;

  return (
    <main className={`flex flex-col ${sectionStackGap}`}>
      <PageHero
        eyebrow={businessPage.eyebrow}
        title={businessPage.title}
        backgroundSrc="/images/negocio_hero.webp"
        ctaLabel={businessPage.ctaLabel}
        ctaHref="#focus-areas"
      />
      <BusinessPageIntro
        eyebrow={businessPage.intro.eyebrow}
        title={businessPage.intro.title}
        body={businessPage.intro.body}
      />
      <BusinessPageFocuses
        eyebrow={businessPage.focusesEyebrow}
        focuses={focuses}
      />
      <BusinessPageMethod
        index={businessPage.method.index}
        eyebrow={businessPage.method.eyebrow}
        title={businessPage.method.title}
        steps={businessPage.method.steps}
        ctaHref={`/${hrefLocale}/contact`}
      />
    </main>
  );
}
