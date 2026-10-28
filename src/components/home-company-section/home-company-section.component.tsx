import { contentFrame } from "@/components/general-layout";
import { CompanyAnimatedPanel } from "@/components/company-animated-panel";
import { SiteButton } from "@/components/site-button";

export type HomeCompanySectionProps = {
  index: string;
  eyebrow: string;
  title: string[];
  lead: string;
  body: string;
  ctaLabel: string;
  ctaHref: string;
};

export function HomeCompanySection({
  index,
  eyebrow,
  title,
  lead,
  body,
  ctaLabel,
  ctaHref,
}: HomeCompanySectionProps) {
  return (
    <div className="relative w-full">
      <CompanyAnimatedPanel
        index={index}
        eyebrow={eyebrow}
        title={title}
        lead={lead}
        headingId="home-company-heading"
      />

      <div className={`${contentFrame} mt-10 sm:mt-12 lg:mt-14`}>
        <div className="grid items-center gap-8 lg:grid-cols-[2fr_1fr] lg:gap-10">
          <p className="text-base font-light leading-relaxed tracking-[0.02em] text-ink/80 sm:text-lg">
            {body}
          </p>
          <div className="flex lg:justify-end">
            <SiteButton href={ctaHref}>{ctaLabel}</SiteButton>
          </div>
        </div>
      </div>
    </div>
  );
}
