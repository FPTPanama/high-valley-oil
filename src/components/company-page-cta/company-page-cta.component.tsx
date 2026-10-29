import { SiteButton } from "@/components/site-button";
import { SiteSection } from "@/components/site-section";

export type CompanyPageCtaProps = {
  eyebrow: string;
  title: string;
  body: string;
  label: string;
  href: string;
};

export function CompanyPageCta({
  eyebrow,
  title,
  body,
  label,
  href,
}: CompanyPageCtaProps) {
  return (
    <SiteSection
      tone="canvas"
      className="mt-8 mb-8 sm:mt-10 sm:mb-12 lg:mt-12 lg:mb-16"
      contentClassName="flex flex-col gap-8 py-12 sm:gap-10 sm:py-16 lg:flex-row lg:items-end lg:justify-between lg:py-20"
      aria-labelledby="company-cta-heading"
    >
      <div className="flex max-w-2xl flex-col gap-5 text-ink">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
          {eyebrow}
        </p>
        <h2
          id="company-cta-heading"
          className="text-3xl font-light tracking-[0.04em] text-balance uppercase sm:text-4xl lg:text-5xl"
        >
          {title}
        </h2>
        <p className="text-base font-light leading-relaxed tracking-[0.02em] text-ink/80 sm:text-lg">
          {body}
        </p>
      </div>
      <div className="shrink-0">
        <SiteButton href={href}>{label}</SiteButton>
      </div>
    </SiteSection>
  );
}
