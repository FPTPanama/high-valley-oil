import { contentFrame, contentInset } from "@/components/general-layout";
import { CompanyAnimatedPanel } from "@/components/company-animated-panel";

export type CompanyPageProps = {
  index: string;
  eyebrow: string;
  title: string[];
  lead: string;
  body: string;
};

export function CompanyPageContent({
  index,
  eyebrow,
  title,
  lead,
  body,
}: CompanyPageProps) {
  return (
    <div className="relative flex w-full flex-col pb-8 sm:pb-12 lg:pb-16">
      <CompanyAnimatedPanel
        index={index}
        eyebrow={eyebrow}
        title={title}
        lead={lead}
        headingId="company-page-heading"
      />

      <div
        className={`${contentFrame} ${contentInset} mt-10 sm:mt-12 lg:mt-14`}
      >
        <p className="max-w-3xl text-base font-light leading-relaxed tracking-[0.02em] text-ink/80 sm:text-lg">
          {body}
        </p>
      </div>
    </div>
  );
}
