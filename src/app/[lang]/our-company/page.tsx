import type { Metadata } from "next";
import { lang } from "next/root-params";
import { sectionStackGap } from "@/components/general-layout";
import { CompanyPageFeature } from "@/components/company-page-feature";
import { CompanyPageIntro } from "@/components/company-page-intro";
import { CompanyPageLead } from "@/components/company-page-lead";
import { CompanyPagePresence } from "@/components/company-page-presence";
import { CompanyPagePrinciples } from "@/components/company-page-principles";
import { PageHero } from "@/components/page-hero";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();

  return { title: dict.nav.ourCompany };
}

export default async function OurCompanyPage() {
  const dict = await getDictionary();
  const locale = await lang();
  const hrefLocale = isLocale(locale) ? locale : "en";
  const { companyPage } = dict;

  return (
    <main className={`flex flex-col ${sectionStackGap}`}>
      <PageHero
        eyebrow={companyPage.eyebrow}
        title={companyPage.title}
        subtitle={companyPage.lead}
      />
      <CompanyPageIntro title={companyPage.intro.title} />
      <CompanyPageLead
        body={companyPage.intro.body}
        ctaLabel={companyPage.intro.ctaLabel}
        ctaHref={`/${hrefLocale}/contact`}
      />
      <CompanyPagePrinciples
        index={companyPage.principles.index}
        eyebrow={companyPage.principles.eyebrow}
        title={companyPage.principles.title}
        items={companyPage.principles.items}
        ctaHref={`/${hrefLocale}/contact`}
      />
      <CompanyPageFeature
        title={companyPage.feature.title}
        body={companyPage.feature.body}
        caption={companyPage.feature.caption}
        action={companyPage.feature.action}
        href={`/${hrefLocale}/services#${companyPage.feature.slug}`}
      />
      <CompanyPagePresence
        eyebrow={companyPage.presence.eyebrow}
        title={companyPage.presence.title}
        body={companyPage.presence.body}
        points={companyPage.presence.points}
      />
    </main>
  );
}
