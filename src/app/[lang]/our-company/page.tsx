import type { Metadata } from "next";
import { sectionStackGap } from "@/components/general-layout";
import { CompanyPageContent } from "@/components/company-page";
import { PageHero } from "@/components/page-hero";
import { getDictionary } from "@/i18n/dictionaries";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();

  return { title: dict.nav.ourCompany };
}

export default async function OurCompanyPage() {
  const dict = await getDictionary();
  const { companyPage } = dict;
  const { company } = dict.home;

  return (
    <main className={`flex flex-col ${sectionStackGap}`}>
      <PageHero
        eyebrow={companyPage.eyebrow}
        title={companyPage.title}
        subtitle={companyPage.lead}
      />
      <CompanyPageContent
        index={company.index}
        eyebrow={company.eyebrow}
        title={company.title}
        lead={company.lead}
        body={company.body}
      />
    </main>
  );
}
