import { lang } from "next/root-params";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "./config";
import type { PageKey } from "./pages";

export type Dictionary = {
  meta: {
    siteName: string;
    brandName: string;
    description: string;
  };
  nav: Record<PageKey | "main" | "language", string>;
  language: Record<Locale, string>;
  home: {
    hero: {
      title: string[];
      subtitle: string;
      cta: string;
    };
  };
  footer: {
    eyebrow: string;
    headline: string;
    cta: string;
    addressLabel: string;
    addressLines: string[];
    addressCountry: string;
    company: string[];
    copyrightOwner: string;
  };
  notFound: {
    title: string;
  };
};

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  en: () => import("./dictionaries/en.json").then((module) => module.default),
  es: () => import("./dictionaries/es.json").then((module) => module.default),
};

export function loadDictionary(locale: Locale) {
  return dictionaries[locale]();
}

export async function getDictionary() {
  const locale = await lang();
  if (!isLocale(locale)) notFound();
  return loadDictionary(locale);
}
