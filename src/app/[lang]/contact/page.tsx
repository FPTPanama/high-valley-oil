import type { Metadata } from "next";
import { lang } from "next/root-params";
import { ContactPageContent } from "@/components/contact-page";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { createPageMetadata } from "@/seo";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await lang();
  const resolvedLocale = isLocale(locale) ? locale : "en";
  const dict = await getDictionary();
  const { contact } = dict.meta.pages;

  return createPageMetadata({
    locale: resolvedLocale,
    path: "/contact",
    title: contact.title,
    description: contact.description,
    siteName: dict.meta.siteName,
  });
}

export default async function ContactPage() {
  const locale = await lang();
  const resolvedLocale = isLocale(locale) ? locale : "en";
  const dict = await getDictionary();
  const { contactPage } = dict;

  return (
    <ContactPageContent
      eyebrow={contactPage.eyebrow}
      title={contactPage.title}
      fields={contactPage.fields}
      submitLabel={contactPage.submitLabel}
      sendingLabel={contactPage.sendingLabel}
      errorMessage={contactPage.errorMessage}
      locale={resolvedLocale}
    />
  );
}
