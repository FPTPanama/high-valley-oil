import { Box } from "lucide-react";
import { lang } from "next/root-params";
import { contentFrame } from "@/components/general-layout";
import { SiteButton } from "@/components/site-button";
import { isLocale } from "@/i18n/config";
import { loadDictionary } from "@/i18n/dictionaries";

export async function SiteFooter() {
  const locale = await lang();
  if (!isLocale(locale)) return null;

  const dict = await loadDictionary(locale);
  const { footer } = dict;
  const contactHref = `/${locale}/contact`;
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto bg-transparent text-ink">
      <div
        className={`${contentFrame} grid gap-12 py-16 sm:py-20 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,0.9fr)] lg:gap-0 lg:py-24`}
      >
        <div className="flex flex-col gap-5 lg:pr-16">
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-ink">
            {footer.eyebrow}
          </p>

          <h2 className="max-w-xl text-3xl font-light tracking-[0.04em] text-balance uppercase sm:text-4xl lg:text-5xl">
            {footer.headline}
          </h2>

          <div>
            <SiteButton href={contactHref}>{footer.cta}</SiteButton>
          </div>

          <p className="mt-auto pt-10 text-xs font-bold tracking-[0.04em] text-ink/70">
            © {year} {footer.copyrightOwner}
          </p>
        </div>

        <div className="flex flex-col gap-8 border-ink lg:border-l lg:pl-16">
          <Box
            aria-hidden="true"
            className="size-5 text-accent"
            strokeWidth={1.75}
          />

          <div className="flex flex-col gap-3">
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-ink">
              {footer.addressLabel}
            </p>
            <address className="not-italic tracking-[0.04em]">
              {footer.addressLines.map((line) => (
                <span
                  key={line}
                  className="block text-base leading-relaxed text-ink sm:text-lg"
                >
                  {line}
                </span>
              ))}
              <span className="mt-2 block text-sm leading-relaxed text-ink">
                {footer.addressCountry}
              </span>
            </address>
          </div>

          <div className="h-px w-full bg-ink" aria-hidden="true" />

          <p className="text-sm font-medium leading-relaxed tracking-[0.04em] text-ink">
            {footer.company.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </p>
        </div>
      </div>
    </footer>
  );
}
