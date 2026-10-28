import type { Metadata } from "next";
import { sectionStackGap } from "@/components/general-layout";
import { CompanyHero } from "@/components/company-hero";
import { CompanyPageContent } from "@/components/company-page";
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
      <CompanyHero
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
