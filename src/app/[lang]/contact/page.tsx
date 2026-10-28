import type { Metadata } from "next";
import { ContactPageContent } from "@/components/contact-page";
import { getDictionary } from "@/i18n/dictionaries";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();

  return { title: dict.nav.contact };
}

export default async function ContactPage() {
  const dict = await getDictionary();
  const { contactPage } = dict;

  return (
    <ContactPageContent
      eyebrow={contactPage.eyebrow}
      title={contactPage.title}
      fields={contactPage.fields}
      submitLabel={contactPage.submitLabel}
    />
  );
}
