import { lang } from "next/root-params";
import { isLocale } from "@/i18n/config";
import { loadDictionary } from "@/i18n/dictionaries";
import { pages } from "@/i18n/pages";
import { AccentRule } from "@/components/accent-rule";
import { contentFrame } from "@/components/general-layout";
import { HomeLink } from "@/components/home-link";
import { SiteHeaderNav } from "@/components/site-header-nav";

export async function SiteHeader() {
  const locale = await lang();
  if (!isLocale(locale)) return null;

  const dict = await loadDictionary(locale);
  const items = pages.map((page) => ({
    href: `/${locale}${page.path}`,
    label: dict.nav[page.key],
  }));

  return (
    <header className="bg-ink text-canvas">
      <div
        className={`${contentFrame} flex flex-col gap-4 py-4 lg:flex-row lg:items-center lg:justify-between`}
      >
        <HomeLink href={`/${locale}`}>{dict.meta.siteName}</HomeLink>
        <SiteHeaderNav
          locale={locale}
          items={items}
          mainLabel={dict.nav.main}
          languageLabel={dict.nav.language}
          languages={dict.language}
        />
      </div>
      <AccentRule />
    </header>
  );
}
