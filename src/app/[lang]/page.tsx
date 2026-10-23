import { lang } from "next/root-params";
import { HomeHero } from "@/components/home-hero";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

export default async function HomePage() {
  const dict = await getDictionary();
  const locale = await lang();
  const hrefLocale = isLocale(locale) ? locale : "en";

  return (
    <HomeHero
      title={dict.home.hero.title}
      subtitle={dict.home.hero.subtitle}
      ctaLabel={dict.home.hero.cta}
      ctaHref={`/${hrefLocale}/our-business`}
    />
  );
}
