import { contentFrame } from "@/components/general-layout";

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
    <section
      className="relative mt-8 w-full sm:mt-10 lg:mt-12"
      aria-labelledby="company-presence-heading"
    >
      <div
        className={`${contentFrame} grid gap-10 py-12 sm:gap-12 sm:py-16 lg:grid-cols-2 lg:gap-12 lg:py-20`}
      >
        <header className="flex flex-col gap-5 text-ink">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
            {eyebrow}
          </p>
          <h2
            id="company-presence-heading"
            className="text-3xl font-light tracking-[0.04em] text-balance uppercase sm:text-4xl lg:text-5xl"
          >
            {title}
          </h2>
        </header>

        <p className="text-base font-light leading-relaxed tracking-[0.02em] text-ink/80 sm:text-lg lg:self-end">
          {body}
        </p>

        {points.map((point) => (
          <div
            key={point.title}
            className="flex flex-col gap-4 border border-ink p-6 text-ink sm:p-8"
          >
            <h3 className="text-xl font-light tracking-[0.04em] text-balance uppercase sm:text-2xl">
              {point.title}
            </h3>
            <p className="text-base font-light leading-relaxed tracking-[0.02em] text-ink/80 sm:text-lg">
              {point.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
