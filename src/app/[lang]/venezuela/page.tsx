import type { Metadata } from "next";
import { sectionStackGap } from "@/components/general-layout";
import { VenezuelaFieldToMarket } from "@/components/venezuela-field-to-market";
import { VenezuelaHero } from "@/components/venezuela-hero";
import { VenezuelaPageContent } from "@/components/venezuela-page";
import { getDictionary } from "@/i18n/dictionaries";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();

  return { title: dict.nav.venezuela };
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
