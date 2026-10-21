"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Languages } from "lucide-react";
import { locales, type Locale } from "@/i18n/config";

type NavItem = {
  href: string;
  label: string;
};

const linkFocus =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent";

export function SiteHeaderNav({
  locale,
  items,
  mainLabel,
  languageLabel,
  languages,
}: {
  locale: Locale;
  items: NavItem[];
  mainLabel: string;
  languageLabel: string;
  languages: Record<Locale, string>;
}) {
  const pathname = usePathname();

  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
      <nav aria-label={mainLabel} className="flex flex-wrap gap-x-4 gap-y-2">
        {items.map((item) => {
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`text-sm ${linkFocus} ${
                active ? "text-accent" : "text-canvas/80 hover:text-canvas"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <nav
        aria-label={languageLabel}
        className="flex items-center gap-3 text-sm"
      >
        <Languages aria-hidden="true" className="size-4 text-canvas/80" />
        {locales.map((code) => {
          const href = pathname.replace(/^\/(en|es)(?=\/|$)/, `/${code}`);
          const active = code === locale;

          return (
            <Link
              key={code}
              href={href}
              hrefLang={code}
              lang={code}
              aria-current={active ? "true" : undefined}
              className={`${linkFocus} ${
                active ? "text-accent" : "text-canvas/80 hover:text-canvas"
              }`}
            >
              {languages[code]}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
