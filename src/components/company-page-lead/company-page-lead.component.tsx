import { contentFrame } from "@/components/general-layout";
import { SiteButton } from "@/components/site-button";

export type CompanyPageLeadProps = {
  body: string;
  ctaLabel: string;
  ctaHref: string;
};

export function CompanyPageLead({
  body,
  ctaLabel,
  ctaHref,
}: CompanyPageLeadProps) {
  return (
    <section
      className="relative mt-10 w-full sm:mt-12 lg:mt-14"
      aria-label={body}
    >
      <div
        className={`${contentFrame} grid items-center gap-8 py-10 sm:gap-10 sm:py-12 lg:grid-cols-2 lg:gap-12 lg:py-14`}
      >
        <p className="text-base font-light leading-relaxed tracking-[0.02em] text-ink/80 sm:text-lg">
          {body}
        </p>
        <div>
          <SiteButton href={ctaHref}>{ctaLabel}</SiteButton>
        </div>
      </div>
    </section>
  );
}
