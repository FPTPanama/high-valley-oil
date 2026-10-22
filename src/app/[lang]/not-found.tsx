import { lang } from "next/root-params";
import { PageHeading } from "@/components/page-heading";
import { defaultLocale, isLocale } from "@/i18n/config";
import { loadDictionary } from "@/i18n/dictionaries";

export default async function NotFound() {
  const locale = await lang();
  const dict = await loadDictionary(isLocale(locale) ? locale : defaultLocale);

  return <PageHeading title={dict.notFound.title} />;
}
