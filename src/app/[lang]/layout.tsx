import type { Metadata } from "next";
import { lang } from "next/root-params";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SmoothScroll } from "@/components/smooth-scroll";
import { urbanist } from "@/fonts/urbanist";
import { defaultLocale, isLocale, locales } from "@/i18n/config";
import { loadDictionary } from "@/i18n/dictionaries";
import { OrganizationJsonLd, SITE_URL } from "@/seo";
import "../globals.css";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export const dynamicParams = false;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await lang();
  const resolvedLocale = isLocale(locale) ? locale : defaultLocale;
  const dict = await loadDictionary(resolvedLocale);

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: dict.meta.pages.home.title,
      template: `%s · ${dict.meta.siteName}`,
    },
    description: dict.meta.description,
    icons: {
      icon: [{ url: "/images/icon.svg", type: "image/svg+xml" }],
      shortcut: "/images/icon.svg",
      apple: "/images/icon.svg",
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: LayoutProps<"/[lang]">) {
  const { lang: locale } = await params;
  const htmlLang = isLocale(locale) ? locale : defaultLocale;
  const dict = await loadDictionary(htmlLang);

  return (
    <html lang={htmlLang} className={`${urbanist.variable} h-full antialiased`}>
      <body className="bg-canvas text-ink">
        <OrganizationJsonLd
          name={dict.meta.siteName}
          description={dict.meta.description}
        />
        {/* Fixed chrome stays outside the smoother wrapper. */}
        <SiteHeader />
        <SmoothScroll>
          <div className="flex min-h-dvh flex-col">
            <div className="flex flex-1 flex-col">{children}</div>
            <SiteFooter />
          </div>
        </SmoothScroll>
      </body>
    </html>
  );
}
