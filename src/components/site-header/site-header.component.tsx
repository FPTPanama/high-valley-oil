import { lang } from "next/root-params";
import { isLocale } from "@/i18n/config";
import { loadDictionary } from "@/i18n/dictionaries";
import { pages } from "@/i18n/pages";
import { SiteHeaderBar } from "./site-header-bar.component";

export async function SiteHeader() {
  const locale = await lang();
  if (!isLocale(locale)) return null;

  const dict = await loadDictionary(locale);
  const navPages = pages.filter((page) => page.key !== "contact");
  const contactPage = pages.find((page) => page.key === "contact");

  const items = navPages.map((page) => ({
    href: `/${locale}${page.path}`,
    label: dict.nav[page.key],
  }));

  const contact = contactPage
    ? {
        href: `/${locale}${contactPage.path}`,
        label: dict.nav.contact,
      }
    : null;

  return (
    <SiteHeaderBar
      locale={locale}
      homeHref={`/${locale}`}
      brandName={dict.meta.brandName}
      items={items}
      contact={contact}
      mainLabel={dict.nav.main}
      languageLabel={dict.nav.language}
      languages={dict.language}
    />
  );
}
