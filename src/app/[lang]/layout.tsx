import type { Metadata } from "next";
import { lang } from "next/root-params";
import { GeneralLayout } from "@/components/general-layout";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { urbanist } from "@/fonts/urbanist";
import { defaultLocale, isLocale, locales } from "@/i18n/config";
import { loadDictionary } from "@/i18n/dictionaries";
import "../globals.css";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export const dynamicParams = false;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await lang();
  const dict = await loadDictionary(isLocale(locale) ? locale : defaultLocale);

  return {
    title: {
      default: dict.meta.siteName,
      template: `%s · ${dict.meta.siteName}`,
    },
    description: dict.meta.description,
  };
}

export default async function RootLayout({
  children,
  params,
}: LayoutProps<"/[lang]">) {
  const { lang: locale } = await params;
  const htmlLang = isLocale(locale) ? locale : defaultLocale;

  return (
    <html lang={htmlLang} className={`${urbanist.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-canvas text-ink">
        <SiteHeader />
        <GeneralLayout>{children}</GeneralLayout>
        <SiteFooter />
      </body>
    </html>
  );
}
