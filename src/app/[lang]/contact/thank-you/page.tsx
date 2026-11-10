import type { Metadata } from "next";
import { lang } from "next/root-params";
import { ContactThankYou } from "@/components/contact-thank-you";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { createPageMetadata } from "@/seo";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await lang();
  const resolvedLocale = isLocale(locale) ? locale : "en";
  const dict = await getDictionary();
  const { thankYou } = dict.contactPage;

  return createPageMetadata({
    locale: resolvedLocale,
    path: "/contact/thank-you",
    title: thankYou.title,
    description: thankYou.body,
    siteName: dict.meta.siteName,
  });
}

export default async function ContactThankYouPage() {
  const locale = await lang();
  const resolvedLocale = isLocale(locale) ? locale : "en";
  const dict = await getDictionary();
  const { thankYou } = dict.contactPage;

  return (
    <ContactThankYou
      eyebrow={thankYou.eyebrow}
      title={thankYou.title}
      body={thankYou.body}
      ctaLabel={thankYou.ctaLabel}
      homeHref={`/${resolvedLocale}`}
    />
  );
}
