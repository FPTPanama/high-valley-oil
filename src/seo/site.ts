export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://highvalleyoil.com";

export const OG_IMAGE = {
  url: "/images/high_valley_metaimage.webp",
  width: 2576,
  height: 1398,
} as const;

export const SITE_ROUTES = [
  "",
  "/our-company",
  "/our-business",
  "/services",
  "/venezuela",
  "/contact",
] as const;

export type SiteRoute = (typeof SITE_ROUTES)[number];
