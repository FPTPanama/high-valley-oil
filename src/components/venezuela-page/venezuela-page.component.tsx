import { SiteSection } from "@/components/site-section";

export type VenezuelaPageStep = {
  index: string;
  title: string;
  body: string;
};

export type VenezuelaPageProps = {
  stepsLabel: string;
  steps: VenezuelaPageStep[];
};

export function VenezuelaPageContent({
  stepsLabel,
  steps,
}: VenezuelaPageProps) {
  return (
    <SiteSection
      tone="canvas"
      className="pb-8 sm:pb-12 lg:pb-16"
      contentClassName="py-12 sm:py-16 lg:py-20"
      aria-label={stepsLabel}
    >
      <ol className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12">
        {steps.map((step) => (
          <li
            key={step.index}
            className="flex flex-col gap-4 border-t border-ink/20 pt-6 text-ink"
          >
            <span className="text-[11px] font-semibold tracking-[0.2em] text-accent">
              {step.index}
            </span>
            <h2 className="text-xl font-bold leading-snug tracking-[0.02em] sm:text-2xl">
              {step.title}
            </h2>
            <p className="text-base font-light leading-relaxed tracking-[0.02em] text-ink/80 sm:text-lg">
              {step.body}
            </p>
          </li>
        ))}
      </ol>
    </SiteSection>
  );
}
