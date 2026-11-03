import type { MetadataRoute } from "next";
import { locales } from "@/i18n/config";
import { SITE_ROUTES, SITE_URL } from "@/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return locales.flatMap((locale) =>
    SITE_ROUTES.map((route) => {
      const path = `/${locale}${route}`;
      const languages = Object.fromEntries(
        locales.map((code) => [code, `${SITE_URL}/${code}${route}`]),
      );

      return {
        url: `${SITE_URL}${path}`,
        lastModified,
        alternates: {
          languages: {
            ...languages,
            "x-default": `${SITE_URL}/en${route}`,
          },
        },
      };
    }),
  );
}
