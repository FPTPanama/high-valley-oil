import { Box } from "lucide-react";
import { lang } from "next/root-params";
import { contentFramePadded } from "@/components/general-layout";
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

  const copyright = (
    <p className="w-full text-xs font-bold tracking-[0.04em] text-ink/70">
      © {year} {footer.copyrightOwner}
    </p>
  );

  return (
    <footer className="mt-auto bg-transparent text-ink">
      <div
        className={`${contentFramePadded} grid gap-8 py-10 sm:gap-12 sm:py-20 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,0.9fr)] lg:gap-0 lg:py-24`}
      >
        <div className="flex min-w-0 flex-col gap-4 sm:gap-5 lg:pr-16">
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-ink">
            {footer.eyebrow}
          </p>

          <h2 className="w-full text-3xl font-light tracking-[0.04em] text-balance uppercase sm:text-4xl lg:max-w-xl lg:text-5xl">
            {footer.headline}
          </h2>

          <div>
            <SiteButton href={contactHref}>{footer.cta}</SiteButton>
          </div>

          {/* Desktop: copyright stays under the CTA column. */}
          <div className="mt-auto hidden pt-10 lg:block">{copyright}</div>
        </div>

        <div className="flex min-w-0 flex-col gap-5 border-ink sm:gap-8 lg:border-l lg:pl-16">
          <Box
            aria-hidden="true"
            className="size-5 text-accent"
            strokeWidth={1.75}
          />

          <div className="flex w-full min-w-0 flex-col gap-3">
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-ink">
              {footer.addressLabel}
            </p>
            <address className="w-full not-italic tracking-[0.04em]">
              {/* Mobile: street lines flow full-width; country stays on its own row. */}
              <span className="lg:hidden">
                <span className="block w-full text-base leading-relaxed text-ink">
                  {footer.addressLines.join(", ")}
                </span>
                <span className="mt-1 block w-full text-sm leading-relaxed text-ink">
                  {footer.addressCountry}
                </span>
              </span>
              <span className="hidden lg:block">
                {footer.addressLines.map((line) => (
                  <span
                    key={line}
                    className="block w-full text-base leading-relaxed text-ink sm:text-lg"
                  >
                    {line}
                  </span>
                ))}
                <span className="mt-2 block w-full text-sm leading-relaxed text-ink">
                  {footer.addressCountry}
                </span>
              </span>
            </address>
          </div>

          <div className="h-px w-full bg-ink" aria-hidden="true" />

          <div className="flex w-full min-w-0 flex-col gap-2">
            {/* Mobile: one flowing line so the name can use the full row width. */}
            <p className="w-full text-sm font-medium leading-relaxed tracking-[0.04em] text-ink lg:hidden">
              {footer.company.join(" ")}
            </p>
            <p className="hidden w-full text-sm font-medium leading-relaxed tracking-[0.04em] text-ink lg:block">
              {footer.company.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </p>
            {/* Mobile: copyright sits under the company name, full width. */}
            <div className="w-full lg:hidden">{copyright}</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
