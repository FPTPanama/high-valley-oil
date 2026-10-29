import { SiteSection } from "@/components/site-section";

export type BusinessPageMethodStep = {
  index: string;
  title: string;
  body: string;
};

export type BusinessPageMethodProps = {
  eyebrow: string;
  title: string;
  steps: BusinessPageMethodStep[];
};

export function BusinessPageMethod({
  eyebrow,
  title,
  steps,
}: BusinessPageMethodProps) {
  return (
    <SiteSection
      tone="ink"
      className="mt-8 sm:mt-10 lg:mt-12"
      contentClassName="flex flex-col gap-12 py-12 sm:gap-16 sm:py-16 lg:py-20"
      aria-labelledby="business-method-heading"
    >
      <header className="flex max-w-3xl flex-col gap-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
          {eyebrow}
        </p>
        <h2
          id="business-method-heading"
          className="text-3xl font-light tracking-[0.04em] text-balance uppercase sm:text-4xl lg:text-5xl"
        >
          {title}
        </h2>
      </header>

      <ol className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12">
        {steps.map((step) => (
          <li
            key={step.index}
            className="flex flex-col gap-4 border-t border-canvas/25 pt-6"
          >
            <span className="text-[11px] font-semibold tracking-[0.18em] text-accent">
              {step.index}
              <span aria-hidden="true"> —</span>
            </span>
            <h3 className="text-xl font-light tracking-[0.04em] text-balance uppercase sm:text-2xl">
              {step.title}
            </h3>
            <p className="text-base font-light leading-relaxed tracking-[0.02em] text-canvas/80 sm:text-lg">
              {step.body}
            </p>
          </li>
        ))}
      </ol>
    </SiteSection>
  );
}
