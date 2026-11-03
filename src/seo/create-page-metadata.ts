import type { Metadata } from "next";
import { locales, type Locale } from "@/i18n/config";
import { OG_IMAGE, SITE_URL } from "./site";

export type CreatePageMetadataInput = {
  locale: Locale;
  /** Path after the locale, e.g. `""` (home) or `"/services"`. */
  path: string;
  title: string;
  description: string;
  siteName: string;
  /** Use an absolute document title (no template suffix). */
  absoluteTitle?: boolean;
};

export function createPageMetadata({
  locale,
  path,
  title,
  description,
  siteName,
  absoluteTitle = false,
}: CreatePageMetadataInput): Metadata {
  const normalizedPath = path === "/" ? "" : path;
  const pagePath = `/${locale}${normalizedPath}`;
  const ogTitle = absoluteTitle ? title : `${title} · ${siteName}`;
  const ogLocale = locale === "es" ? "es_ES" : "en_US";

  const languages = Object.fromEntries(
    locales.map((code) => [code, `${SITE_URL}/${code}${normalizedPath}`]),
  ) as Record<string, string>;
  languages["x-default"] = `${SITE_URL}/en${normalizedPath}`;

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: {
      canonical: pagePath,
      languages,
    },
    openGraph: {
      type: "website",
      siteName,
      title: ogTitle,
      description,
      locale: ogLocale,
      url: pagePath,
      images: [
        {
          ...OG_IMAGE,
          alt: siteName,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
      images: [OG_IMAGE.url],
    },
  };
}
