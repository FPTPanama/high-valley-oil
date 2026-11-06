import {
  contentColumn,
  contentInsetAfterGutter,
} from "@/components/general-layout";
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
      className="relative mt-0 w-full"
      aria-label={body}
    >
      <div
        className={`${contentColumn} ${contentInsetAfterGutter} grid items-center gap-8 pt-5 pb-10 sm:gap-10 sm:pt-8 sm:pb-12 lg:grid-cols-2 lg:gap-12 lg:pt-10 lg:pb-14`}
      >
        <p className="text-base font-light leading-relaxed tracking-[0.02em] text-ink/80 sm:text-lg">
          {body}
        </p>
        <div className="w-full sm:w-auto">
          <SiteButton href={ctaHref} layout="spread" className="sm:w-auto">
            {ctaLabel}
          </SiteButton>
        </div>
      </div>
    </section>
  );
}
