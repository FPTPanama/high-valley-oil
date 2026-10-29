import { SiteSection } from "@/components/site-section";

export type CompanyPageLeadProps = {
  body: string;
};

export function CompanyPageLead({ body }: CompanyPageLeadProps) {
  return (
    <SiteSection
      tone="canvas"
      className="mt-10 sm:mt-12 lg:mt-14"
      contentClassName="flex items-center justify-center py-10 sm:py-12 lg:py-14"
      aria-label={body}
    >
      <p className="max-w-3xl text-center text-base font-light leading-relaxed tracking-[0.02em] text-ink/80 sm:text-lg">
        {body}
      </p>
    </SiteSection>
  );
}
