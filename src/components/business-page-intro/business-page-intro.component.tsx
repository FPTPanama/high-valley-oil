import { SiteSection } from "@/components/site-section";

export type BusinessPageIntroProps = {
  eyebrow: string;
  title: string;
  body: string;
};

export function BusinessPageIntro({
  eyebrow,
  title,
  body,
}: BusinessPageIntroProps) {
  return (
    <SiteSection
      tone="canvas"
      className="mt-16 sm:mt-20 lg:mt-24"
      contentClassName="grid gap-8 py-12 sm:py-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-end lg:gap-12 lg:py-20"
      aria-labelledby="business-intro-heading"
    >
      <div className="flex flex-col gap-5 text-ink">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
          {eyebrow}
        </p>
        <h2
          id="business-intro-heading"
          className="text-3xl font-light tracking-[0.04em] text-balance uppercase sm:text-4xl lg:text-5xl"
        >
          {title}
        </h2>
      </div>
      <p className="max-w-xl text-base font-light leading-relaxed tracking-[0.02em] text-ink/80 sm:text-lg lg:justify-self-end">
        {body}
      </p>
    </SiteSection>
  );
}
