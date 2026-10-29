import { SiteSection } from "@/components/site-section";

export type CompanyPagePresencePoint = {
  title: string;
  body: string;
};

export type CompanyPagePresenceProps = {
  eyebrow: string;
  title: string;
  body: string;
  points: CompanyPagePresencePoint[];
};

export function CompanyPagePresence({
  eyebrow,
  title,
  body,
  points,
}: CompanyPagePresenceProps) {
  return (
    <SiteSection
      tone="canvas"
      className="mt-8 sm:mt-10 lg:mt-12"
      contentClassName="flex flex-col gap-12 py-12 sm:gap-16 sm:py-16 lg:py-20"
      aria-labelledby="company-presence-heading"
    >
      <header className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end lg:gap-12">
        <div className="flex flex-col gap-5 text-ink">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
            {eyebrow}
          </p>
          <h2
            id="company-presence-heading"
            className="text-3xl font-light tracking-[0.04em] text-balance uppercase sm:text-4xl lg:text-5xl"
          >
            {title}
          </h2>
        </div>
        <p className="max-w-xl text-base font-light leading-relaxed tracking-[0.02em] text-ink/80 sm:text-lg lg:justify-self-end">
          {body}
        </p>
      </header>

      <ul className="grid gap-8 sm:grid-cols-2 sm:gap-10 lg:gap-12">
        {points.map((point) => (
          <li
            key={point.title}
            className="flex flex-col gap-4 border-t border-ink/20 pt-6 text-ink"
          >
            <h3 className="text-xl font-light tracking-[0.04em] text-balance uppercase sm:text-2xl">
              {point.title}
            </h3>
            <p className="text-base font-light leading-relaxed tracking-[0.02em] text-ink/80 sm:text-lg">
              {point.body}
            </p>
          </li>
        ))}
      </ul>
    </SiteSection>
  );
}
